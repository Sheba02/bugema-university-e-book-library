"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { BookInput } from "@/lib/validators";

interface BookFormProps {
  onSubmit: (data: BookInput) => Promise<void>;
  isSubmitting?: boolean;
}

export function BookForm({ onSubmit, isSubmitting }: BookFormProps) {
  const [form, setForm] = useState<Omit<BookInput, "pages">>({
    title: "",
    description: "",
    category: "",
    folder: "",
    coverImage: "",
    isVisible: true,
  });
  const [pagesInput, setPagesInput] = useState("");

  const handleChange = <K extends keyof typeof form>(
    field: K,
    value: (typeof form)[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: BookInput = {
      ...form,
      pages: pagesInput
        .split("\n")
        .map((page) => page.trim())
        .filter(Boolean),
    };

    await onSubmit(payload);
    setForm({
      title: "",
      description: "",
      category: "",
      folder: "",
      coverImage: "",
      isVisible: true,
    });
    setPagesInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={form.title}
          onChange={(event) => handleChange("title", event.target.value)}
          placeholder="e.g. Introduction to Algorithms"
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(event) => handleChange("description", event.target.value)}
          placeholder="Short summary to help students understand the book."
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={form.category}
            onChange={(event) => handleChange("category", event.target.value)}
            placeholder="e.g. Computer Science"
            required
          />
        </div>
        <div>
          <Label htmlFor="folder">Book Folder (under /public/books)</Label>
          <Input
            id="folder"
            value={form.folder}
            onChange={(event) => handleChange("folder", event.target.value)}
            placeholder="e.g. intro-to-algo"
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="pages">Page image paths</Label>
        <Textarea
          id="pages"
          value={pagesInput}
          onChange={(event) => setPagesInput(event.target.value)}
          placeholder={"/books/intro-to-algo/1.jpg\n/books/intro-to-algo/2.jpg"}
          required
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Upload your book images inside <code>/public/books/[folder]/</code>{" "}
          and list each file path on a new line (e.g., <code>/books/my-book/1.jpg</code>).
        </p>
      </div>
      <div>
        <Label htmlFor="cover">Cover image (optional)</Label>
        <Input
          id="cover"
          value={form.coverImage}
          onChange={(event) => handleChange("coverImage", event.target.value)}
          placeholder="/books/intro-to-algo/cover.jpg (optional)"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          id="visible"
          type="checkbox"
          checked={form.isVisible}
          onChange={(event) => handleChange("isVisible", event.target.checked)}
        />
        <Label htmlFor="visible">Visible to students</Label>
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
        {isSubmitting ? "Saving..." : "Add Book"}
      </Button>
    </form>
  );
}

