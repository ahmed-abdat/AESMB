"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createTeam } from "@/app/actions/teams";
import { TeamFormData } from "@/types/team";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/config/firebase";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { IconUpload } from "@tabler/icons-react";
import { validateImageFile } from "@/lib/validators";
import { TeamActionError } from "@/types/errors";
import { uploadImage } from "@/lib/uploadImage";

interface SimpleSeason {
  id: string;
  name: string;
}

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  logo: z.any().optional(),
  seasons: z.array(z.string()),
});

interface AddTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddTeamDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddTeamDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [availableSeasons, setAvailableSeasons] = useState<SimpleSeason[]>([]);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const form = useForm<TeamFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      logo: null,
      seasons: [],
    },
  });

  const fetchSeasons = async () => {
    try {
      const seasonsRef = collection(db, "seasons");
      const seasonsQuery = query(seasonsRef, orderBy("startDate", "desc"));
      const querySnapshot = await getDocs(seasonsQuery);

      const seasonsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));

      setAvailableSeasons(seasonsData);
    } catch (error) {
      console.error("Error fetching seasons:", error);
      toast.error("Erreur lors du chargement des saisons");
    }
  };

  useEffect(() => {
    if (open) {
      fetchSeasons();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      form.reset();
      setLogoPreview(null);
    }
  }, [open, form]);

  const handleLogoChange = (file: File | null) => {
    if (file) {
      try {
        validateImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
        return;
      }
    } else {
      setLogoPreview(null);
    }
  };

  const onSubmit = async (values: TeamFormData) => {
    setIsLoading(true);
    try {
      let logoUrl = "";
      if (values.logo) {
        try {
          validateImageFile(values.logo);
          const uploadResult = await uploadImage(values.logo);
          logoUrl = uploadResult.url;
        } catch (error) {
          if (error instanceof Error) {
            toast.error(error.message);
          }
          setIsLoading(false);
          return;
        }
      }

      const result = await createTeam({
        name: values.name.trim(),
        logoUrl,
        seasons: values.seasons,
      });

      if (result.success) {
        toast.success("Équipe créée avec succès");
        onSuccess();
        onOpenChange(false);
        form.reset();
        setLogoPreview(null);
      } else if (result.error) {
        if (result.error.code === "duplicate_name") {
          form.setError("name", { message: result.error.message });
        } else {
          toast.error(result.error.message);
        }
      }
    } catch (error) {
      console.error("Error creating team:", error);
      toast.error("Erreur lors de la création de l'équipe");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter une équipe</DialogTitle>
          <DialogDescription>
            Créez une nouvelle équipe pour le championnat
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de l'équipe</FormLabel>
                  <FormControl>
                    <Input placeholder="FC Barcelona" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logo"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Logo de l'équipe</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center">
                        {logoPreview ? (
                          <div className="relative w-32 h-32">
                            <Image
                              src={logoPreview}
                              alt="Logo preview"
                              fill
                              sizes="(max-width: 128px) 100vw, 128px"
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
                            <IconUpload className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          onChange(file);
                          handleLogoChange(file);
                        }}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seasons"
              render={() => (
                <FormItem>
                  <FormLabel>Saisons</FormLabel>
                  <div className="space-y-2">
                    {availableSeasons.map((season) => (
                      <FormField
                        key={season.id}
                        control={form.control}
                        name="seasons"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(season.id)}
                                onCheckedChange={(checked) => {
                                  const updatedSeasons = checked
                                    ? [...field.value, season.id]
                                    : field.value.filter(
                                        (id) => id !== season.id
                                      );
                                  field.onChange(updatedSeasons);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {season.name}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Création..." : "Créer"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
