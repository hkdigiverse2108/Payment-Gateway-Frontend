import { FieldCard } from "../Common";

export const ProfileSection = ({
  section,
  values,
  editingField,
  setEditingField,
}: any) => {
  const SectionIcon = section.icon;
  return (
    <section className="rounded-2xl border border-border/20 bg-surface p-5 shadow-sm">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-tableback/40 text-muted">
          <SectionIcon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-black text-foreground">
            {section.title}
          </h3>
          <p className="text-sm text-muted">{section.description}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {section.fields.map((field: any) => (
          <FieldCard key={field.name} field={field} value={values[field.name]} isEditing={editingField === field.name} onToggle={() => setEditingField( editingField === field.name ? null : field.name ) } />
        ))}
      </div>
    </section>
  );
};