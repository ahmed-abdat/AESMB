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
import { createSeason } from "@/app/actions/seasons";
import { SeasonFormData } from "@/types/season";

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

interface AddSeasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddSeasonDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddSeasonDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SeasonFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      startDate: undefined,
      endDate: undefined,
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const onSubmit = async (values: SeasonFormData) => {
    setIsLoading(true);
    try {
      const startDate = new Date(values.startDate);
      const endDate = new Date(values.endDate);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error("Dates invalides");
      }

      const result = await createSeason({
        name: values.name.trim(),
        startDate,
        endDate,
      });

      if (result.success) {
        toast.success("Saison créée avec succès", {
          description: `La saison "${values.name}" a été créée`,
        });
        onSuccess();
        onOpenChange(false);
        form.reset();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error instanceof Error) {
        if (error.message.includes("existe déjà")) {
          form.setError("name", { message: error.message });
        } else if (error.message.includes("Dates invalides")) {
          toast.error("Les dates sélectionnées sont invalides");
        } else {
          toast.error("Erreur lors de la création de la saison");
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
          <DialogTitle>Ajouter une saison</DialogTitle>
          <DialogDescription>
            Créez une nouvelle saison pour le championnat
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
