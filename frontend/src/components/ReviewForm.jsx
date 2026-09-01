import { useState } from "react";
import { api } from "../api/client";
import { useToast, Button, Field, inputClass } from "./ui";

const EMPTY = { name: "", role: "", rating: 5, content: "" };

export default function ReviewForm({ onSubmitted }) {
  const toast = useToast();
  const [form, setForm] = useState(EMPTY);
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.content.trim()) {
      toast.error("Please add your name and a few words about your experience.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.createReview({
        name: form.name.trim(),
        role: form.role.trim(),
        rating: form.rating,
        content: form.content.trim(),
      });
      toast.success(res.message || "Thanks for your review!");
      setForm(EMPTY);
      onSubmitted?.();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-5">
        <Field label="Your Name" required>
          <input className={inputClass} value={form.name} onChange={set("name")} placeholder="Enter your full name" maxLength={80} autoComplete="name" />
        </Field>
        <Field label="Course / Role">
          <input className={inputClass} value={form.role} onChange={set("role")} placeholder="e.g. Full Stack Development" maxLength={100} />
        </Field>
      </div>

      <Field label="Your Rating" required>
        <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={form.rating === n}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              onClick={() => setForm((f) => ({ ...f, rating: n }))}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              className="rounded-lg p-1 text-2xl transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              <i
                className={`ti ti-star-filled ${
                  n <= (hover || form.rating) ? "text-amber-400" : "text-slate-200"
                }`}
              />
            </button>
          ))}
          <span className="ml-2 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{form.rating}/5</span>
        </div>
      </Field>

      <Field label="Your Review" required>
        <textarea
          className={inputClass}
          rows={4}
          maxLength={800}
          value={form.content}
          onChange={set("content")}
          placeholder="Tell us about the training, mentors and support you received..."
        />
      </Field>

      <Button type="submit" variant="accent" size="lg" disabled={submitting} className="w-full">
        {submitting ? "Submitting..." : "Submit my review"}
        {!submitting && <i className="ti ti-send" />}
      </Button>
      <p className="text-center text-xs text-slate-400">
        By submitting, you confirm this reflects your own experience.
      </p>
    </form>
  );
}
