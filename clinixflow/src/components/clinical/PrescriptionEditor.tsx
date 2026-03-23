import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Bold, Italic, List, ListOrdered, Undo, Redo, FileSignature } from "lucide-react";

interface PrescriptionEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
  professionalId: string;
  appointmentId?: string;
  onCreated: () => void;
}

const PrescriptionEditor = ({
  open,
  onOpenChange,
  patientId,
  professionalId,
  appointmentId,
  onCreated,
}: PrescriptionEditorProps) => {
  const { tenantId } = useAuth();
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState("");

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[200px] p-3 focus:outline-none",
      },
    },
  });

  const handleSave = async (sign: boolean) => {
    if (!editor || !tenantId) return;
    const content = editor.getHTML();
    if (content === "<p></p>" || !content.trim()) {
      toast.error("Escreva o conteúdo da prescrição.");
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("prescriptions" as any).insert({
      tenant_id: tenantId,
      patient_id: patientId,
      professional_id: professionalId,
      appointment_id: appointmentId || null,
      content,
      notes: notes || null,
      is_signed: sign,
      signed_at: sign ? new Date().toISOString() : null,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(sign ? "Prescrição assinada e salva!" : "Rascunho salvo!");
      editor.commands.setContent("");
      setNotes("");
      onOpenChange(false);
      onCreated();
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading flex items-center gap-2">
            <FileSignature className="h-5 w-5" />
            Nova Prescrição
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Toolbar */}
          {editor && (
            <div className="flex flex-wrap gap-1 border rounded-md p-1 bg-muted/30">
              <Button
                type="button" variant="ghost" size="icon" className="h-8 w-8"
                onClick={() => editor.chain().focus().toggleBold().run()}
                data-active={editor.isActive("bold") || undefined}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                type="button" variant="ghost" size="icon" className="h-8 w-8"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                data-active={editor.isActive("italic") || undefined}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                type="button" variant="ghost" size="icon" className="h-8 w-8"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                data-active={editor.isActive("bulletList") || undefined}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                type="button" variant="ghost" size="icon" className="h-8 w-8"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                data-active={editor.isActive("orderedList") || undefined}
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              <div className="w-px h-6 bg-border self-center mx-1" />
              <Button
                type="button" variant="ghost" size="icon" className="h-8 w-8"
                onClick={() => editor.chain().focus().undo().run()}
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                type="button" variant="ghost" size="icon" className="h-8 w-8"
                onClick={() => editor.chain().focus().redo().run()}
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Editor */}
          <div className="border rounded-md overflow-hidden">
            <EditorContent editor={editor} />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Observações internas</Label>
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Notas internas (não aparece na prescrição)"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => handleSave(false)} disabled={saving}>
              Salvar Rascunho
            </Button>
            <Button className="flex-1" onClick={() => handleSave(true)} disabled={saving}>
              <FileSignature className="h-4 w-4 mr-1" />
              Assinar e Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrescriptionEditor;
