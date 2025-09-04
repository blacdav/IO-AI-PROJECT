"use client"
import { ModelMetricsCard } from "@/components/model-metrics-card"
import { ModelComparisonTable } from "@/components/model-comparison-table"
import { PerformanceChart } from "@/components/performance-chart"
import { ModelSelector } from "@/components/model-selector"
import { useEffect, useState } from "react"



export default function Dashboard() {
  const [apiData, setApiData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://io-ai-project.onrender.com/evaluate", {
          headers: {
          "Content-Type": "application/json"
          }
        })
        const data = await response.json()
        setApiData(data)
        console.log("[v0] API data received:", data)
      } catch (error) {
        console.error("[v0] API call failed:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

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

        {/* Model Comparison Table */}
        <ModelComparisonTable />
      </div>
    </div>
  )
}
