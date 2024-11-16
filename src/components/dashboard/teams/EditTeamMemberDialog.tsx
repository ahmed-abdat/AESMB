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
import { TeamMember, TeamMemberFormData } from "@/types/team";
import { updateTeamMember } from "@/app/actions/teams";

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  number: z.coerce
    .number()
    .min(1, "Le numéro doit être supérieur à 0")
    .max(99, "Le numéro doit être inférieur à 100"),
});

interface EditTeamMemberDialogProps {
  teamId: string;
  member: TeamMember;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditTeamMemberDialog({
  teamId,
  member,
  open,
  onOpenChange,
  onSuccess,
}: EditTeamMemberDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TeamMemberFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: member.name,
      number: member.number,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: member.name,
        number: member.number,
      });
    }
  }, [open, member, form]);

  const onSubmit = async (values: TeamMemberFormData) => {
    setIsLoading(true);
    try {
      const result = await updateTeamMember(teamId, member.id, values);

      if (result.success) {
        toast.success("Joueur mis à jour avec succès");
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error(result.error?.message || "Erreur lors de la mise à jour du joueur");
      }
    } catch (error) {
      console.error("Error updating team member:", error);
      toast.error("Erreur lors de la mise à jour du joueur");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le joueur</DialogTitle>
          <DialogDescription>
            Modifiez les informations du joueur
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
                {isLoading ? "Mise à jour..." : "Mettre à jour"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 