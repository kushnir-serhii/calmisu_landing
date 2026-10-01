import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { KitExample } from "../KitExample";

export const DialogDemo = () => {
  return (
    <KitExample label="Dialog">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="pill">Open dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm action</DialogTitle>
            <DialogDescription>
              Are you sure you want to proceed? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-foreground">
            Please review the details carefully before confirming.
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button size="pill" className="bg-transparent text-foreground border border-input hover:bg-muted">
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button size="pill" variant="dark">
                Confirm
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </KitExample>
  );
};
