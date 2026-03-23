import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/EmptyState";
import { toast } from "@/components/ui/sonner";
import { FileText, Upload, Download, Search, Trash2, Eye, Loader2 } from "lucide-react";
import { format } from "date-fns";

const categoryLabels: Record<string, string> = {
  MEDICAL_REQUEST: "Pedido Médico",
  LAB_RESULT: "Resultado Lab.",
  INSURANCE_AUTHORIZATION: "Autorização",
  TREATMENT_CONTRACT: "Contrato",
  ATTENDANCE_CERTIFICATE: "Atestado",
  OTHER: "Outro",
};

const Documents = () => {
  const { tenantId, user, userRole } = useAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [form, setForm] = useState({ patientId: "", name: "", category: "OTHER", file: null as File | null });
  const [previewDoc, setPreviewDoc] = useState<any | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const isAdmin = userRole?.role === "ORG_ADMIN";

  const fetchDocs = async () => {
    if (!tenantId) return;
    let query = supabase
      .from("documents")
      .select("*, patients!inner(full_name, record_number)")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false });

    if (search) {
      query = query.or(`name.ilike.%${search}%,patients.full_name.ilike.%${search}%`);
    }

    const { data } = await query;
    setDocuments(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchDocs(); }, [tenantId, search]);

  useEffect(() => {
    if (!tenantId) return;
    supabase.from("patients").select("id, full_name, record_number")
      .eq("tenant_id", tenantId).eq("is_active", true).order("full_name")
      .then(({ data }) => setPatients(data || []));
  }, [tenantId]);

  const handleUpload = async () => {
    if (!tenantId || !form.patientId || !form.name || !form.file) return;
    setSaving(true);

    const fileExt = form.file.name.split(".").pop();
    const filePath = `${tenantId}/${form.patientId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from("documents").upload(filePath, form.file);
    if (uploadError) {
      toast.error("Erro ao enviar arquivo: " + uploadError.message);
      setSaving(false);
      return;
    }

    // Store the file path, not a public URL (bucket is private)
    const { error } = await supabase.from("documents").insert({
      tenant_id: tenantId,
      patient_id: form.patientId,
      name: form.name,
      category: form.category as any,
      file_url: filePath,
      file_type: form.file.type,
      file_size: form.file.size,
      created_by: user?.id || null,
    });

    if (error) toast.error(error.message);
    else {
      toast.success("Documento enviado!");
      setDialogOpen(false);
      setForm({ patientId: "", name: "", category: "OTHER", file: null });
      fetchDocs();
    }
    setSaving(false);
  };

  const getSignedUrl = async (fileUrl: string): Promise<string | null> => {
    const { data, error } = await supabase.storage.from("documents").createSignedUrl(fileUrl, 3600);
    if (error) {
      toast.error("Erro ao gerar link: " + error.message);
      return null;
    }
    return data.signedUrl;
  };

  const handlePreview = async (doc: any) => {
    setPreviewDoc(doc);
    setPreviewUrl(null);
    const url = await getSignedUrl(doc.file_url);
    setPreviewUrl(url);
  };

  const handleDownload = async (doc: any) => {
    const url = await getSignedUrl(doc.file_url);
    if (url) window.open(url, "_blank");
  };

  const handleDelete = async (docId: string, fileUrl: string) => {
    if (!confirm("Deseja realmente excluir este documento?")) return;
    setDeleting(docId);

    // Delete from storage
    await supabase.storage.from("documents").remove([fileUrl]);

    // Delete from DB
    const { error } = await supabase.from("documents").delete().eq("id", docId);
    if (error) toast.error(error.message);
    else {
      toast.success("Documento excluído!");
      setDocuments(prev => prev.filter(d => d.id !== docId));
      if (previewDoc?.id === docId) { setPreviewDoc(null); setPreviewUrl(null); }
    }
    setDeleting(null);
  };

  const getPreviewContent = () => {
    if (!previewDoc) return null;
    if (!previewUrl) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }
    const type = previewDoc.file_type || "";
    if (type.startsWith("image/")) {
      return <img src={previewUrl} alt={previewDoc.name} className="max-w-full max-h-[70vh] object-contain mx-auto rounded" />;
    }
    if (type === "application/pdf") {
      return <iframe src={previewUrl} className="w-full h-[70vh] rounded border" title={previewDoc.name} />;
    }
    return (
      <div className="text-center py-8 space-y-4">
        <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
        <p className="text-muted-foreground">Pré-visualização não disponível para este tipo de arquivo.</p>
        <Button onClick={() => handleDownload(previewDoc)}>
          <Download className="h-4 w-4 mr-1" /> Baixar arquivo
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Documentos</h1>
          <p className="text-sm text-muted-foreground">Gestão de documentos dos pacientes</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Upload className="h-4 w-4 mr-1" /> Enviar Documento</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-heading">Enviar Documento</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Paciente *</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.patientId} onChange={e => setForm(p => ({ ...p, patientId: e.target.value }))}>
                  <option value="">Selecionar paciente</option>
                  {patients.map(p => <option key={p.id} value={p.id}>#{p.record_number} - {p.full_name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Nome do documento *</Label>
                <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Ex: Laudo de exame" />
              </div>
              <div className="space-y-2">
                <Label>Categoria</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                  {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Arquivo *</Label>
                <Input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={e => setForm(p => ({ ...p, file: e.target.files?.[0] || null }))} />
              </div>
              <Button onClick={handleUpload} disabled={saving || !form.patientId || !form.name || !form.file} className="w-full">
                {saving ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar documentos..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
          ) : documents.length === 0 ? (
            <EmptyState icon={FileText} title="Nenhum documento" description="Envie o primeiro documento." actionLabel="Enviar Documento" onAction={() => setDialogOpen(true)} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map(doc => (
                  <TableRow key={doc.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handlePreview(doc)}>
                    <TableCell className="font-medium">{doc.name}</TableCell>
                    <TableCell className="text-sm">{doc.patients?.full_name} <span className="text-muted-foreground">#{doc.patients?.record_number}</span></TableCell>
                    <TableCell>
                      <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{categoryLabels[doc.category] || doc.category}</span>
                    </TableCell>
                    <TableCell className="text-sm">{format(new Date(doc.created_at), "dd/MM/yyyy")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1" onClick={e => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" onClick={() => handlePreview(doc)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDownload(doc)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        {isAdmin && (
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(doc.id, doc.file_url)} disabled={deleting === doc.id}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={!!previewDoc} onOpenChange={(o) => { if (!o) { setPreviewDoc(null); setPreviewUrl(null); } }}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {previewDoc?.name}
            </DialogTitle>
          </DialogHeader>
          {previewDoc && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>Paciente: <strong className="text-foreground">{previewDoc.patients?.full_name}</strong></span>
                <span>Categoria: <strong className="text-foreground">{categoryLabels[previewDoc.category] || previewDoc.category}</strong></span>
                <span>Data: <strong className="text-foreground">{format(new Date(previewDoc.created_at), "dd/MM/yyyy HH:mm")}</strong></span>
              </div>
              {getPreviewContent()}
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => handleDownload(previewDoc)}>
                  <Download className="h-4 w-4 mr-1" /> Baixar
                </Button>
                {isAdmin && (
                  <Button variant="destructive" onClick={() => handleDelete(previewDoc.id, previewDoc.file_url)} disabled={deleting === previewDoc.id}>
                    <Trash2 className="h-4 w-4 mr-1" /> Excluir
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Documents;
