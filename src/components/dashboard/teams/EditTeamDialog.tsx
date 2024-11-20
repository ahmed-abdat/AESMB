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
import { updateTeam } from "@/app/actions/teams";
import { Team, TeamFormData } from "@/types/team";
import Image from "next/image";
import { IconUpload, IconX } from "@tabler/icons-react";
import { validateImageFile } from "@/lib/validators";
import { uploadImage } from "@/lib/uploadImage";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/config/firebase";
import { Checkbox } from "@/components/ui/checkbox";

interface SimpleSeason {
  id: string;
  name: string;
}

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  logo: z.union([
    z.custom<File>(),
    z.string()
  ]).refine((val) => val !== "", {
    message: "Le logo est requis"
  }),
  seasons: z.array(z.string()).default([]),
});

type FormValues = z.infer<typeof formSchema>;

interface EditTeamDialogProps {
  team: Team;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTeamDialog({
  team,
  open,
  onOpenChange,
}: EditTeamDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(team.logo);
  const [shouldDeleteLogo, setShouldDeleteLogo] = useState(false);
  const [availableSeasons, setAvailableSeasons] = useState<SimpleSeason[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: team.name,
      logo: team.logo,
      seasons: team.seasons,
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
      form.reset({
        name: team.name,
        logo: team.logo,
        seasons: team.seasons,
      });
      setLogoPreview(team.logo);
      setShouldDeleteLogo(false);
    }
  }, [open, team, form]);

  const handleLogoChange = (file: File | null) => {
    if (file) {
      try {
        validateImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoPreview(reader.result as string);
          setShouldDeleteLogo(false);
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

  const handleDeleteLogo = () => {
    toast.error("Le logo est requis");
    return;
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      let logoUrl = undefined;

      if (values.logo instanceof File) {
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

      const result = await updateTeam(team.id, {
        name: values.name.trim(),
        seasons: values.seasons,
        ...(logoUrl && { logoUrl }),
      });

      if (result.success) {
        toast.success("Équipe mise à jour avec succès");
        onOpenChange(false);
      } else if (result.error) {
        toast.error(result.error.message);
      }
    } catch (error) {
      console.error("Error updating team:", error);
      toast.error("Erreur lors de la mise à jour de l'équipe");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier l&apos;équipe</DialogTitle>
          <DialogDescription>
            Modifiez les informations de l&apos;équipe
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de l&apos;équipe</FormLabel>
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
                  <FormLabel>Logo de l&apos;équipe</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center">
                        {logoPreview ? (
                          <div className="relative w-32 h-32 group">
                            <Image
                              src={logoPreview}
                              alt="Logo preview"
                              fill
                              sizes="(max-width: 128px) 100vw, 128px"
                              className="object-contain"
                            />
                            <button
                              type="button"
                              onClick={handleDeleteLogo}
                              className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <IconX className="w-4 h-4" />
                            </button>
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
                {isLoading ? "Mise à jour..." : "Mettre à jour"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
