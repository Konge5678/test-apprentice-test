"use client";

import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  value: string;
  onChange: (value: string) => void;
  minutes?: string[];
};

function splitTime(value: string) {
  const [h, m] = value.split(":");
  const hour = h?.padStart(2, "0") ?? "00";
  const minute = m?.padStart(2, "0") ?? "00";
  return { hour, minute };
}

export function TimeSelect({ value, onChange, minutes }: Props) {
  const hours = useMemo(
    () => Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0")),
    [],
  );
  const minuteOptions = minutes ?? ["00", "15", "30", "45"];
  const { hour, minute } = splitTime(value);

  return (
    <div className="grid grid-cols-2 gap-2">
      <Select
        value={hour}
        onValueChange={(newHour) => onChange(`${newHour}:${minute}`)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Time" />
        </SelectTrigger>
        <SelectContent>
          {hours.map((h) => (
            <SelectItem key={h} value={h}>
              {h}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={minute}
        onValueChange={(newMinute) => onChange(`${hour}:${newMinute}`)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Min" />
        </SelectTrigger>
        <SelectContent>
          {minuteOptions.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
