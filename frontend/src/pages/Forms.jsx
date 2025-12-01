import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, endpoints } from "../api/client.js";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Table } from "../components/ui/Table.jsx";
import { Link } from "react-router-dom";
import { CopySnippet } from "../components/CopySnippet.jsx";
import { Input } from "../components/ui/Input.jsx";
import { Modal } from "../components/ui/Modal.jsx";

export default function Forms() {
  const qc = useQueryClient();
  const [snippetOpen, setSnippetOpen] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState("");
  const [websiteId, setWebsiteId] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [createWebsiteId, setCreateWebsiteId] = useState("");
  const [createFormUrl, setCreateFormUrl] = useState("");
  const [createFieldsCsv, setCreateFieldsCsv] = useState("");
  const { data: websites = [] } = useQuery({
    queryKey: ["websites"],
    queryFn: async () => (await api.get(endpoints.websites)).data,
  });
  const { data: forms = [], isLoading } = useQuery({
    queryKey: ["forms", websiteId],
    queryFn: async () =>
      (
        await api.get(endpoints.forms, {
          params: { websiteId: websiteId || undefined },
        })
      ).data,
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) =>
      (await api.delete(`${endpoints.forms}/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["forms"] }),
  });
  const createMutation = useMutation({
    mutationFn: async (payload) =>
      (await api.post(endpoints.forms, payload)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["forms"] });
      setCreateOpen(false);
      setCreateWebsiteId("");
      setCreateFormUrl("");
      setCreateFieldsCsv("");
      alert("Form created");
    },
    onError: (err) =>
      alert(err?.response?.data?.message || "Failed to create form"),
  });

  const columns = useMemo(
    () => [
      {
        key: "websiteId",
        header: "Website",
        render: (_, row) =>
          websites.find((w) => w._id === row.websiteId)?.name || "—",
      },
      { key: "formUrl", header: "Form URL" },
      {
        key: "fields",
        header: "Fields",
        render: (v) => (v || []).map((f) => f.name).join(", "),
      },
      {
        key: "actions",
        header: "Actions",
        render: (_, row) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                setSelectedFormId(row._id);
                setSnippetOpen(true);
              }}
            >
              Snippet
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => deleteMutation.mutate(row._id)}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [websites]
  );

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">Forms</h3>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setCreateOpen(true)}>
              Create Manually
            </Button>
            <Link to="/forms/manual">
              <Button>Manual Extraction</Button>
            </Link>
          </div>
        </div>
        <div className="mt-3">
          <select
            className="rounded-md border border-input bg-transparent px-3 py-2 text-sm"
            value={websiteId}
            onChange={(e) => setWebsiteId(e.target.value)}
          >
            <option value="">All websites</option>
            {websites.map((w) => (
              <option key={w._id} value={w._id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
      </Card>
      <Card>
        {isLoading ? "Loading..." : <Table columns={columns} data={forms} />}
      </Card>
      <CopySnippet
        open={snippetOpen}
        onClose={() => setSnippetOpen(false)}
        backendUrl={import.meta.env.VITE_API_URL || "http://localhost:5000"}
        formId={selectedFormId}
      />
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create Form Manually"
        footer={
          <>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                const fields = (createFieldsCsv || "")
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((name) => ({ name, type: "text" }));
                createMutation.mutate({
                  websiteId:
                    createWebsiteId || websiteId || websites[0]?._id || "",
                  formUrl: createFormUrl,
                  fields,
                });
              }}
              disabled={
                !createFormUrl ||
                (!createWebsiteId && !websiteId && websites.length === 0)
              }
            >
              Create
            </Button>
          </>
        }
      >
        <div className="grid gap-3">
          <div>
            <label className="mb-1 block text-sm">Website</label>
            <select
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              value={createWebsiteId || websiteId}
              onChange={(e) => setCreateWebsiteId(e.target.value)}
            >
              {websites.map((w) => (
                <option key={w._id} value={w._id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm">Form URL</label>
            <Input
              placeholder="https://example.com/contact"
              value={createFormUrl}
              onChange={(e) => setCreateFormUrl(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm">
              Field names (comma-separated)
            </label>
            <Input
              placeholder="name,email,phone,message"
              value={createFieldsCsv}
              onChange={(e) => setCreateFieldsCsv(e.target.value)}
            />
            <div className="mt-1 text-xs text-muted-foreground">
              Optional — you can leave empty; the snippet will still capture
              whatever fields exist.
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
