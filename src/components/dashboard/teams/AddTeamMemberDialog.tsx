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
import { TeamMemberFormData } from "@/types/team";
import { addTeamMember } from "@/app/actions/teams";

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  number: z.coerce
    .number()
    .min(1, "Le numéro doit être supérieur à 0")
    .max(99, "Le numéro doit être inférieur à 100"),
});

interface AddTeamMemberDialogProps {
  teamId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddTeamMemberDialog({
  teamId,
  open,
  onOpenChange,
  onSuccess,
}: AddTeamMemberDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TeamMemberFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      number: undefined,
    },
  });

  const onSubmit = async (values: TeamMemberFormData) => {
    setIsLoading(true);
    try {
      const result = await addTeamMember(teamId, values);

      if (result.success) {
        toast.success("Joueur ajouté avec succès");
        onSuccess();
        onOpenChange(false);
        form.reset();
      } else {
        toast.error(result.error?.message || "Erreur lors de l'ajout du joueur");
      }
    } catch (error) {
      console.error("Error adding team member:", error);
      toast.error("Erreur lors de l'ajout du joueur");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un joueur</DialogTitle>
          <DialogDescription>
            Ajoutez un nouveau joueur à l'équipe
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du joueur</FormLabel>
                  <FormControl>
                    <Input placeholder="Lionel Messi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="10"
                      min={1}
                      max={99}
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