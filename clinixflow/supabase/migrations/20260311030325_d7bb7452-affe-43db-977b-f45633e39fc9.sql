
-- Storage RLS policies for documents bucket
CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = (SELECT get_user_tenant_id(auth.uid()))::text
);

CREATE POLICY "Authenticated users can view documents in their tenant"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = (SELECT get_user_tenant_id(auth.uid()))::text
);

CREATE POLICY "Admins can delete documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = (SELECT get_user_tenant_id(auth.uid()))::text AND
  has_tenant_role(auth.uid(), (SELECT get_user_tenant_id(auth.uid())), ARRAY['ORG_ADMIN'::org_role])
);
