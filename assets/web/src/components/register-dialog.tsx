"use client";

import { useLanguage } from "@/components/language-provider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

interface RegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RegisterDialog({ open, onOpenChange }: RegisterDialogProps) {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);

  const interests = [
    { key: "form.interest.csrd" as const, id: "csrd" },
    { key: "form.interest.ecovadis" as const, id: "ecovadis" },
    { key: "form.interest.bcorp" as const, id: "bcorp" },
    { key: "form.interest.msci" as const, id: "msci" },
    { key: "form.interest.taxonomy" as const, id: "taxonomy" },
    { key: "form.interest.csddd" as const, id: "csddd" },
    { key: "form.interest.humanrights" as const, id: "humanrights" },
    { key: "form.interest.climate" as const, id: "climate" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) setSubmitted(false);
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        {submitted ? (
          <div className="flex flex-col items-center py-10 text-center">
            <CheckCircle2 className="mb-4 h-12 w-12 text-accent" />
            <h3 className="mb-2 font-serif text-2xl font-semibold text-primary">
              {t("form.success")}
            </h3>
            <p className="text-sm text-muted-foreground">{t("form.privacy")}</p>
            <Button className="mt-6" onClick={() => handleOpenChange(false)}>
              {t("nav.login")}
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">{t("form.title")}</DialogTitle>
              <DialogDescription>{t("form.subtitle")}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">{t("form.name")} *</Label>
                <Input id="name" required placeholder={t("form.name.placeholder")} className="bg-background" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="company">{t("form.company")}</Label>
                <Input id="company" placeholder="Criteri ESG S.L." className="bg-background" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">{t("form.email")} *</Label>
                <Input id="email" type="email" required placeholder="nom@empresa.com" className="bg-background" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sector">{t("form.sector")} *</Label>
                <Select required>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder={t("form.sector")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultant">{t("form.sector.consultant")}</SelectItem>
                    <SelectItem value="director">{t("form.sector.director")}</SelectItem>
                    <SelectItem value="compliance">{t("form.sector.compliance")}</SelectItem>
                    <SelectItem value="investor">{t("form.sector.investor")}</SelectItem>
                    <SelectItem value="ngo">{t("form.sector.ngo")}</SelectItem>
                    <SelectItem value="public">{t("form.sector.public")}</SelectItem>
                    <SelectItem value="other">{t("form.sector.other")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("form.interests")}</Label>
                <div className="grid grid-cols-2 gap-2 rounded-md border border-rule bg-background p-3">
                  {interests.map((interest) => (
                    <div key={interest.id} className="flex items-center space-x-2">
                      <Checkbox id={interest.id} />
                      <Label htmlFor={interest.id} className="cursor-pointer text-xs font-normal">
                        {t(interest.key)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">{t("form.privacy")}</p>
              <Button type="submit" size="lg" className="w-full">
                {t("form.submit")}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
