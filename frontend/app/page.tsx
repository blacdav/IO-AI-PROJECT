"use client"

import { useEffect, useState } from "react"
import { ModelMetricsCard } from "@/components/model-metrics-card"
import { ModelComparisonTable } from "@/components/model-comparison-table"
import { PerformanceChart } from "@/components/performance-chart"
import { ModelSelector } from "@/components/model-selector"

interface MatrixEvaluation {
  id: string
  input: string
  expected: string
  prediction: string
  isCorrect: boolean
  latency: number
  tokens: number
}

export default function Dashboard() {
  const [apiData, setApiData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [matrixData, setMatrixData] = useState<MatrixEvaluation[]>([])
  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini");
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://io-ai-project.onrender.com/evaluate")
        const data = await response.json()
        setApiData(data)
        console.log("[v0] API data received:", data)

        if (data && data.evaluations) {
          setMatrixData(data.evaluations)
        } else {
          // Sample data if API doesn't provide evaluations
          setMatrixData([
            {
              id: "1",
              input: "What is the capital of France?",
              expected: "Paris",
              prediction: "Paris",
              isCorrect: true,
              latency: 245,
              tokens: 12,
            },
            {
              id: "2",
              input: "Translate 'hello' to Spanish",
              expected: "hola",
              prediction: "hola",
              isCorrect: true,
              latency: 189,
              tokens: 8,
            },
            {
              id: "3",
              input: "What is 2 + 2?",
              expected: "4",
              prediction: "5",
              isCorrect: false,
              latency: 156,
              tokens: 6,
            },
            {
              id: "4",
              input: "Name a programming language",
              expected: "JavaScript",
              prediction: "Python",
              isCorrect: true,
              latency: 203,
              tokens: 10,
            },
          ])
        }
      } catch (error) {
        console.error("[v0] API call failed:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleClassify = async () => {
    const res = await fetch("/api/classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: selectedModel, text: inputText }),
    });
    const data = await res.json();
    setResult(data.output);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">AI Model Evaluation Dashboard</h1>
          <p className="text-muted-foreground">Monitor and compare your machine learning models' performance</p>
        </div>

        {/* Model Selector */}
        <ModelSelector />

        {/* Key Metrics Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <ModelMetricsCard
            title="Accuracy"
            value="94.2%"
            change="+2.1%"
            trend="up"
            description="Overall model accuracy"
          />
          <ModelMetricsCard
            title="Precision"
            value="91.8%"
            change="+1.5%"
            trend="up"
            description="Positive prediction accuracy"
          />
          <ModelMetricsCard title="Recall" value="89.3%" change="-0.8%" trend="down" description="True positive rate" />
          <ModelMetricsCard
            title="F1 Score"
            value="90.5%"
            change="+0.3%"
            trend="up"
            description="Harmonic mean of precision and recall"
          />
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          <PerformanceChart title="Model Performance Over Time" type="line" />
          <PerformanceChart title="Metric Comparison" type="bar" />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">Evaluation Matrix</h2>
            <p className="text-muted-foreground">Detailed evaluation results for each model prediction</p>
          </div>

          <div className="rounded-lg border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Input</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Expected</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Prediction</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Correct</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Latency (ms)</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Tokens</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {matrixData.map((row) => (
                    <tr key={row.id} className="hover:bg-muted/25">
                      <td className="px-4 py-3 text-sm max-w-xs truncate" title={row.input}>
                        {row.input}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">{row.expected}</td>
                      <td className="px-4 py-3 text-sm font-medium">{row.prediction}</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex h-2 w-2 rounded-full ${
                            row.isCorrect ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-mono">{row.latency}</td>
                      <td className="px-4 py-3 text-sm text-right font-mono">{row.tokens}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Model Comparison Table */}
        <ModelComparisonTable />
      </div>
    </div>
  )
}
