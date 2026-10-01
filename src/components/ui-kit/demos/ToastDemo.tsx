import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { KitExample } from "../KitExample";

const TOAST_EXAMPLES: {
  id: string;
  label: string;
  buttonText: string;
  fire: () => void;
}[] = [
  { id: "plain", label: "Plain", buttonText: "Show toast", fire: () => toast("Saved") },
  {
    id: "description",
    label: "With description",
    buttonText: "Show toast",
    fire: () => toast("Plan sent", { description: "Check your inbox." }),
  },
  { id: "success", label: "Success", buttonText: "Show success", fire: () => toast.success("Profile updated") },
  { id: "error", label: "Error", buttonText: "Show error", fire: () => toast.error("Something went wrong") },
  {
    id: "action",
    label: "With action (closes the toast)",
    buttonText: "Show toast",
    // sonner closes the toast after an action click by default
    fire: () => toast("Item archived", { action: { label: "Undo", onClick: () => {} } }),
  },
];

export const ToastDemo = () => {
  return (
    <>
      {TOAST_EXAMPLES.map((example) => (
        <KitExample key={example.id} label={example.label}>
          <Button size="pill" onClick={example.fire}>
            {example.buttonText}
          </Button>
        </KitExample>
      ))}
    </>
  );
};
