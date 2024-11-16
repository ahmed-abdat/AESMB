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
import { Match, MatchResult } from "@/types/season";
import { Team } from "@/types/team";
import { updateMatchResult } from "@/app/actions/seasons";

const formSchema = z.object({
  homeScore: z.coerce.number().min(0, "Le score doit être positif"),
  awayScore: z.coerce.number().min(0, "Le score doit être positif"),
  stats: z.object({
    homeTeam: z.object({
      possession: z.coerce.number().min(0).max(100),
      shots: z.coerce.number().min(0),
      shotsOnTarget: z.coerce.number().min(0),
      corners: z.coerce.number().min(0),
      fouls: z.coerce.number().min(0),
    }),
    awayTeam: z.object({
      possession: z.coerce.number().min(0).max(100),
      shots: z.coerce.number().min(0),
      shotsOnTarget: z.coerce.number().min(0),
      corners: z.coerce.number().min(0),
      fouls: z.coerce.number().min(0),
    }),
  }),
});

interface MatchResultDialogProps {
  seasonId: string;
  roundId: string;
  match: Match;
  homeTeam: Team;
  awayTeam: Team;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function MatchResultDialog({
  seasonId,
  roundId,
  match,
  homeTeam,
  awayTeam,
  open,
  onOpenChange,
  onSuccess,
}: MatchResultDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      homeScore: match.result?.homeScore ?? 0,
      awayScore: match.result?.awayScore ?? 0,
      stats: {
        homeTeam: {
          possession: match.result?.stats?.homeTeam.possession ?? 50,
          shots: match.result?.stats?.homeTeam.shots ?? 0,
          shotsOnTarget: match.result?.stats?.homeTeam.shotsOnTarget ?? 0,
          corners: match.result?.stats?.homeTeam.corners ?? 0,
          fouls: match.result?.stats?.homeTeam.fouls ?? 0,
        },
        awayTeam: {
          possession: match.result?.stats?.awayTeam.possession ?? 50,
          shots: match.result?.stats?.awayTeam.shots ?? 0,
          shotsOnTarget: match.result?.stats?.awayTeam.shotsOnTarget ?? 0,
          corners: match.result?.stats?.awayTeam.corners ?? 0,
          fouls: match.result?.stats?.awayTeam.fouls ?? 0,
        },
      },
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const result = await updateMatchResult(seasonId, roundId, match.id, {
        ...values,
        status: 'completed' as const,
      });

      if (result.success) {
        toast.success("Résultat enregistré avec succès");
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error(result.error?.message || "Erreur lors de l'enregistrement du résultat");
      }
    } catch (error) {
      console.error("Error updating match result:", error);
      toast.error("Erreur lors de l'enregistrement du résultat");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Résultat du match</DialogTitle>
          <DialogDescription>
            {homeTeam.name} vs {awayTeam.name}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="font-medium">{homeTeam.name}</h3>
                <FormField
                  control={form.control}
                  name="homeScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Score</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stats.homeTeam.possession"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Possession (%)</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} max={100} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stats.homeTeam.shots"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tirs</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stats.homeTeam.shotsOnTarget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tirs cadrés</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stats.homeTeam.corners"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Corners</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stats.homeTeam.fouls"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fautes</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">{awayTeam.name}</h3>
                <FormField
                  control={form.control}
                  name="awayScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Score</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stats.awayTeam.possession"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Possession (%)</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} max={100} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stats.awayTeam.shots"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tirs</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stats.awayTeam.shotsOnTarget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tirs cadrés</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stats.awayTeam.corners"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Corners</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stats.awayTeam.fouls"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fautes</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                {isLoading ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 