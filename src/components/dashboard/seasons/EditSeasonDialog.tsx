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
import { DatePicker } from "@/components/ui/date-picker";
import { isAfter } from "date-fns";
import { updateSeason } from "@/app/actions/seasons";
import { Season, SeasonFormData } from "@/@types/season";

const formSchema = z
  .object({
    name: z.string().min(1, "Le nom est requis"),
    startDate: z.date({
      required_error: "La date de début est requise",
    }),
    endDate: z.date({
      required_error: "La date de fin est requise",
    }),
  })
  .refine(
    (data) => {
      return isAfter(data.endDate, data.startDate);
    },
    {
      message: "La date de fin doit être après la date de début",
      path: ["endDate"],
    }
  );

interface EditSeasonDialogProps {
  season: Season;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditSeasonDialog({
  season,
  open,
  onOpenChange,
  onSuccess,
}: EditSeasonDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SeasonFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: season.name,
      startDate: season.startDate,
      endDate: season.endDate,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: season.name,
        startDate: season.startDate,
        endDate: season.endDate,
      });
    }
  }, [open, season, form]);

  const onSubmit = async (values: SeasonFormData) => {
    setIsLoading(true);
    try {
      const result = await updateSeason(season.id, values);

      if (result.success) {
        toast.success("Saison mise à jour avec succès", {
          description: `La saison "${values.name}" a été mise à jour`,
        });
        onSuccess();
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error updating season:", error);
      if (error instanceof Error) {
        if (error.message.includes("existe déjà")) {
          form.setError("name", { message: error.message });
        } else {
          toast.error("Erreur lors de la mise à jour de la saison");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier la saison</DialogTitle>
          <DialogDescription>
            Modifiez les informations de la saison
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de la saison</FormLabel>
                  <FormControl>
                    <Input placeholder="2024-2025" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de début</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de fin</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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