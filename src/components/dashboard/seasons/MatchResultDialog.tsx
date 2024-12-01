"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Match } from "@/types/season";
import { Team } from "@/types/team";
import { updateMatchResult } from "@/app/actions/seasons";
import { IconPlus, IconX } from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const goalSchema = z.object({
  id: z.string(),
  type: z.enum(["regular", "own"]).default("regular"),
  scorerId: z.string().optional(),
  assistId: z.string().optional(),
});

const formSchema = z.object({
  homeGoals: z.array(goalSchema),
  awayGoals: z.array(goalSchema),
});

type FormValues = z.infer<typeof formSchema>;

interface MatchResultDialogProps {
  seasonId: string;
  roundId: string;
  match: Match;
  homeTeam: Team;
  awayTeam: Team;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MatchResultDialog({
  seasonId,
  roundId,
  match,
  homeTeam,
  awayTeam,
  open,
  onOpenChange,
}: MatchResultDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      homeGoals:
        match.result?.goals?.home.map((goal) => ({
          ...goal,
          type: goal.type || "regular",
          assistId: goal.assistId || "none",
        })) || [],
      awayGoals:
        match.result?.goals?.away.map((goal) => ({
          ...goal,
          type: goal.type || "regular",
          assistId: goal.assistId || "none",
        })) || [],
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        homeGoals:
          match.result?.goals?.home.map((goal) => ({
            ...goal,
            type: goal.type || "regular",
            assistId: goal.assistId || "none",
          })) || [],
        awayGoals:
          match.result?.goals?.away.map((goal) => ({
            ...goal,
            type: goal.type || "regular",
            assistId: goal.assistId || "none",
          })) || [],
      });
    }
  }, [open, match, form]);

  const {
    fields: homeGoalFields,
    append: appendHomeGoal,
    remove: removeHomeGoal,
  } = useFieldArray({
    control: form.control,
    name: "homeGoals",
  });

  const {
    fields: awayGoalFields,
    append: appendAwayGoal,
    remove: removeAwayGoal,
  } = useFieldArray({
    control: form.control,
    name: "awayGoals",
  });

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const processedValues = {
        homeGoals: values.homeGoals.map((goal) => {
          if (goal.type === "own") {
            return {
              id: goal.id,
              type: "own" as const,
            };
          }
          return {
            ...goal,
            assistId: goal.assistId === "none" ? undefined : goal.assistId,
          };
        }),
        awayGoals: values.awayGoals.map((goal) => {
          if (goal.type === "own") {
            return {
              id: goal.id,
              type: "own" as const,
            };
          }
          return {
            ...goal,
            assistId: goal.assistId === "none" ? undefined : goal.assistId,
          };
        }),
      };

      const result = await updateMatchResult(seasonId, roundId, match.id, {
        homeScore: processedValues.homeGoals.length,
        awayScore: processedValues.awayGoals.length,
        goals: {
          home: processedValues.homeGoals,
          away: processedValues.awayGoals,
        },
      });

      if (result.success) {
        toast.success("Résultat mis à jour avec succès");
        form.reset();
        onOpenChange(false);
      } else {
        toast.error(
          result.error?.message || "Erreur lors de la mise à jour du résultat"
        );
      }
    } catch (error) {
      console.error("Error updating match result:", error);
      toast.error("Erreur lors de la mise à jour du résultat");
    } finally {
      setIsLoading(false);
    }
  };

  const addGoal = (team: "home" | "away") => {
    const newGoal = {
      id: crypto.randomUUID(),
      type: "regular" as const,
      scorerId: "",
      assistId: "none",
    };

    if (team === "home") {
      appendHomeGoal(newGoal);
    } else {
      appendAwayGoal(newGoal);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[800px] h-[90vh] p-0 flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>Résultat du match</DialogTitle>
          <DialogDescription>
            {homeTeam.name} vs {awayTeam.name}
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 overflow-x-scroll"
          >
            <div className="flex-1 min-h-0 px-6 py-4">
              <div className="grid grid-cols-2 gap-8 h-full">
                {/* Home Team Goals */}
                <div className="flex flex-col min-h-0">
                  <div className="sticky top-0 bg-background py-2 z-10">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{homeTeam.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {homeGoalFields.length} but
                          {homeGoalFields.length > 1 ? "s" : ""}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addGoal("home")}
                        className="gap-2"
                      >
                        <IconPlus className="w-4 h-4" />
                        Ajouter
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                    {homeGoalFields.map((field, index) => (
                      <Card key={field.id}>
                        <CardContent className="p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              But {index + 1}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeHomeGoal(index)}
                            >
                              <IconX className="w-4 h-4" />
                            </Button>
                          </div>

                          <FormField
                            control={form.control}
                            name={`homeGoals.${index}.scorerId`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Buteur</FormLabel>
                                <Select
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    if (value === "own") {
                                      form.setValue(`homeGoals.${index}.type`, 'own');
                                      form.setValue(`homeGoals.${index}.assistId`, 'none');
                                    } else {
                                      form.setValue(`homeGoals.${index}.type`, 'regular');
                                    }
                                  }}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Sélectionner le buteur" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem 
                                      value="own" 
                                      className="text-red-600 font-medium border-b"
                                    >
                                      🥅 But contre son camp
                                    </SelectItem>
                                    {homeTeam.members
                                      .sort((a, b) => a.name.localeCompare(b.name))
                                      .map((player) => (
                                        <SelectItem key={player.id} value={player.id}>
                                          {player.name}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {form.watch(`homeGoals.${index}.scorerId`) !==
                            "own" && (
                            <FormField
                              control={form.control}
                              name={`homeGoals.${index}.assistId`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Passeur (optionnel)</FormLabel>
                                  <Select
                                    onValueChange={(value) =>
                                      field.onChange(value)
                                    }
                                    value={field.value || "none"}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner le passeur" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="none">
                                        Aucun passeur
                                      </SelectItem>
                                      {homeTeam.members
                                        .sort((a, b) =>
                                          a.name.localeCompare(b.name)
                                        )
                                        .map((player) => (
                                          <SelectItem
                                            key={player.id}
                                            value={player.id}
                                          >
                                            {player.name}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Away Team Goals */}
                <div className="flex flex-col min-h-0">
                  <div className="sticky top-0 bg-background py-2 z-10">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{awayTeam.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {awayGoalFields.length} but
                          {awayGoalFields.length > 1 ? "s" : ""}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addGoal("away")}
                        className="gap-2"
                      >
                        <IconPlus className="w-4 h-4" />
                        Ajouter
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                    {awayGoalFields.map((field, index) => (
                      <Card key={field.id}>
                        <CardContent className="p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              But {index + 1}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAwayGoal(index)}
                            >
                              <IconX className="w-4 h-4" />
                            </Button>
                          </div>

                          <FormField
                            control={form.control}
                            name={`awayGoals.${index}.scorerId`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Buteur</FormLabel>
                                <Select
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    if (value === "own") {
                                      form.setValue(`awayGoals.${index}.type`, 'own');
                                      form.setValue(`awayGoals.${index}.assistId`, 'none');
                                    } else {
                                      form.setValue(`awayGoals.${index}.type`, 'regular');
                                    }
                                  }}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Sélectionner le buteur" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem 
                                      value="own" 
                                      className="text-red-600 font-medium border-b"
                                    >
                                      🥅 But contre son camp
                                    </SelectItem>
                                    {awayTeam.members
                                      .sort((a, b) => a.name.localeCompare(b.name))
                                      .map((player) => (
                                        <SelectItem key={player.id} value={player.id}>
                                          {player.name}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {form.watch(`awayGoals.${index}.scorerId`) !==
                            "own" && (
                            <FormField
                              control={form.control}
                              name={`awayGoals.${index}.assistId`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Passeur (optionnel)</FormLabel>
                                  <Select
                                    onValueChange={(value) =>
                                      field.onChange(value)
                                    }
                                    value={field.value || "none"}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner le passeur" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="none">
                                        Aucun passeur
                                      </SelectItem>
                                      {awayTeam.members
                                        .sort((a, b) =>
                                          a.name.localeCompare(b.name)
                                        )
                                        .map((player) => (
                                          <SelectItem
                                            key={player.id}
                                            value={player.id}
                                          >
                                            {player.name}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="p-4 bg-background mt-auto">
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
