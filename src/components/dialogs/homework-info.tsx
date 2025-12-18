"use client";

import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Save, X, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { HomeworkRow } from "../homework-table";

interface Subject {
  id: string;
  name: string;
  color: string;
}

interface HomeworkInfoProps {
  homework: HomeworkRow;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (vars: {
    homeworkId: string;
    title?: string;
    description?: string;
    dueDate?: Date;
    completed?: boolean;
    subjectId?: string;
  }) => Promise<
    | {
        id: string;
        title: string;
        description: string | null;
        dueDate: Date | null;
        completed: boolean;
        subjectId: string;
      }
    | undefined
  >;
  onDelete: (vars: { homeworkId: string }) => Promise<void>;
  subjects: Subject[];
  updateMutation?: {
    isPending: boolean;
  };
  deleteMutation?: {
    isPending: boolean;
  };
}

export function HomeworkInfo({
  homework,
  open,
  onOpenChange,
  onUpdate,
  onDelete,
  subjects,
  updateMutation,
  deleteMutation,
}: HomeworkInfoProps) {
  const t = useTranslations("HomeworkInfo");
  const [isEditing, setIsEditing] = React.useState(false);
  const [editData, setEditData] = React.useState({
    title: homework.title,
    description: homework.description || "",
    dueDate: homework.dueDate
      ? new Date(homework.dueDate).toISOString().split("T")[0]
      : "",
    completed: homework.completed,
    subjectId: homework.subjectId,
  });

  const prevHomeworkIdRef = React.useRef(homework.id);

  React.useEffect(() => {
    if (open) {
      const isNewHomework = prevHomeworkIdRef.current !== homework.id;
      prevHomeworkIdRef.current = homework.id;

      setEditData({
        title: homework.title,
        description: homework.description || "",
        dueDate: homework.dueDate
          ? new Date(homework.dueDate).toISOString().split("T")[0]
          : "",
        completed: homework.completed,
        subjectId: homework.subjectId,
      });

      if (isNewHomework) {
        setIsEditing(false);
      }
    }
  }, [homework, open]);

  const handleSave = async () => {
    try {
      const updatedHomework = await onUpdate({
        homeworkId: homework.id,
        title: editData.title,
        description: editData.description || undefined,
        dueDate: editData.dueDate ? new Date(editData.dueDate) : undefined,
        completed: editData.completed,
        subjectId: editData.subjectId,
      });

      if (updatedHomework) {
        setEditData({
          title: updatedHomework.title,
          description: updatedHomework.description || "",
          dueDate: updatedHomework.dueDate
            ? new Date(updatedHomework.dueDate).toISOString().split("T")[0]
            : "",
          completed: updatedHomework.completed,
          subjectId: updatedHomework.subjectId,
        });
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update homework:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (confirm(t("delete_confirmation"))) {
      try {
        await onDelete({ homeworkId: homework.id });
      } catch (error) {
        console.error("Failed to delete homework:", error);
        alert("Failed to delete homework. Please try again.");
      }
    }
  };

  const selectedSubject = subjects.find((s) => s.id === editData.subjectId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 bg-background border-2">
        <div className="px-6 py-6 border-b">
          <div className="flex items-start justify-between mb-3">
            {isEditing ? (
              <Select
                value={editData.subjectId}
                onValueChange={(value) =>
                  setEditData({ ...editData, subjectId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("select_subject")} />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: subject.color }}
                        />
                        {subject.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              selectedSubject && (
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: selectedSubject.color }}
                  />
                  <span className="text-sm font-medium">
                    {selectedSubject.name}
                  </span>
                </div>
              )
            )}
          </div>
          <div className="flex items-center justify-between">
            <div>
              {isEditing ? (
                <Input
                  value={editData.title}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                  placeholder={t("title")}
                  className="mb-2"
                />
              ) : (
                <h2 className="text-2xl font-bold flex-1 mr-4">
                  {homework.title}
                </h2>
              )}

              {isEditing ? (
                <Input
                  type="date"
                  value={editData.dueDate}
                  onChange={(e) =>
                    setEditData({ ...editData, dueDate: e.target.value })
                  }
                />
              ) : (
                <span className="text-1xl font-bold flex-1 whitespace-nowrap text-right text-muted-foreground">
                  {homework.dueDate
                    ? new Date(homework.dueDate).toLocaleDateString()
                    : t("no_due_date")}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={isEditing ? editData.completed : homework.completed}
                  onCheckedChange={(checked) => {
                    if (isEditing) {
                      setEditData({ ...editData, completed: !!checked });
                    }
                  }}
                  disabled={!isEditing}
                />
                <span className="text-sm text-muted-foreground">
                  {isEditing ? editData.completed : homework.completed}{" "}
                  {t("completed")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="px-6 py-6 flex-1">
          <div className="min-h-[200px] p-4 border-2 rounded-lg bg-muted/20">
            {isEditing ? (
              <Textarea
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                placeholder={t("description")}
                className="min-h-[180px] border-none p-0 bg-transparent resize-none focus-visible:ring-0"
              />
            ) : (
              <div className="text-sm leading-relaxed">
                {homework.description || (
                  <span className="text-muted-foreground italic">
                    {t("no_description")}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    {t("edit")}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    {t("delete")}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setEditData({
                        title: homework.title,
                        description: homework.description || "",
                        dueDate: homework.dueDate
                          ? new Date(homework.dueDate)
                              .toISOString()
                              .split("T")[0]
                          : "",
                        completed: homework.completed,
                        subjectId: homework.subjectId,
                      });
                    }}
                    disabled={
                      updateMutation?.isPending || deleteMutation?.isPending
                    }
                  >
                    <X className="h-4 w-4 mr-2" />
                    {t("cancel")}
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="gap-2"
                    disabled={
                      updateMutation?.isPending || deleteMutation?.isPending
                    }
                  >
                    <Save className="h-4 w-4" />
                    {updateMutation?.isPending ? t("saving") : t("save")}
                  </Button>
                </>
              )}
            </div>

            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t("close")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
