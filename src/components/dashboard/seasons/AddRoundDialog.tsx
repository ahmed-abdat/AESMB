"use client";

import { useState } from "react";
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
import { addRound } from "@/app/actions/seasons";

const formSchema = z.object({
  number: z.coerce
    .number()
    .min(1, "Le numéro doit être supérieur à 0"),
});

interface AddRoundDialogProps {
  seasonId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddRoundDialog({
  seasonId,
  open,
  onOpenChange,
  onSuccess,
}: AddRoundDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<{ number: number }>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: undefined,
    },
  });

  const onSubmit = async (values: { number: number }) => {
    setIsLoading(true);
    try {
      const result = await addRound(seasonId, values.number);

      if (result.success) {
        toast.success("Journée ajoutée avec succès");
        onSuccess();
        onOpenChange(false);
        form.reset();
      } else {
        toast.error(result.error?.message || "Erreur lors de l'ajout de la journée");
      }
    } catch (error) {
      console.error("Error adding round:", error);
      toast.error("Erreur lors de l'ajout de la journée");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter une journée</DialogTitle>
          <DialogDescription>
            Ajoutez une nouvelle journée à la saison
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro de la journée</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="1"
                      min={1}
                      {...field}
                    />
                  </FormControl>
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
                {isLoading ? "Ajout..." : "Ajouter"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 