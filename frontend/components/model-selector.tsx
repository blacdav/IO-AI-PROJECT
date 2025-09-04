"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const models = [
  { id: "bert-base", name: "BERT Base", status: "active", version: "v2.1" },
  { id: "gpt-3.5", name: "GPT-3.5 Turbo", status: "training", version: "v1.3" },
  { id: "roberta-large", name: "RoBERTa Large", status: "active", version: "v1.8" },
  { id: "distilbert", name: "DistilBERT", status: "deprecated", version: "v1.0" },
]

export function ModelSelector() {
  const [selectedModel, setSelectedModel] = useState("bert-base")

  const currentModel = models.find((model) => model.id === selectedModel)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Selection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex items-center space-x-2">
                      <span>{model.name}</span>
                      <Badge variant={model.status === "active" ? "default" : "secondary"}>{model.status}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {currentModel && (
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{currentModel.version}</Badge>
              <Badge variant={currentModel.status === "active" ? "default" : "secondary"}>{currentModel.status}</Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
