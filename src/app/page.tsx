"use client";

import { useState, useCallback, useRef } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Upload,
  CheckCircle2,
  Sparkles,
  FileJson,
  BarChart3,
  User,
  BookOpen,
  Zap,
  FolderOpen,
  MessageSquare,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { AIService, WizardStep, MigrationAnalysis } from "@/lib/types";
import { services, exportGuides } from "@/lib/services";
import { parseUploadedFile } from "@/lib/parser";

export default function Home() {
  const [step, setStep] = useState<WizardStep>("landing");
  const [selectedService, setSelectedService] = useState<AIService | null>(null);
  const [analysis, setAnalysis] = useState<MigrationAnalysis | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [copiedProfile, setCopiedProfile] = useState(false);
  const [showSkipOption, setShowSkipOption] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (selectedService) {
          setStep("analyzing");
          // Simulate analysis time for better UX
          setTimeout(() => {
            const result = parseUploadedFile(content, selectedService);
            setAnalysis(result);
            setStep("results");
          }, 2000);
        }
      };
      reader.readAsText(file);
    },
    [selectedService]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileUpload(file);
    },
    [handleFileUpload]
  );

  const generateClaudeProfile = () => {
    if (!analysis) return "";
    const p = analysis.userProfile;
    return `Hi Claude! I recently switched from ${services.find((s) => s.id === selectedService)?.name || "another AI"} and wanted to share some context about how I work:

**My main interests:** ${p.interests.join(", ")}
**What I typically use AI for:** ${p.commonTasks.join(", ")}
**My communication style:** ${p.communicationStyle}
${p.expertise.length > 0 ? `**Areas I work in:** ${p.expertise.join(", ")}` : ""}

I've had ${analysis.totalConversations} conversations covering topics like ${analysis.topTopics.slice(0, 3).join(", ")}. I prefer responses that match my style â ${p.communicationStyle}.

Looking forward to working with you!`;
  };

  const copyProfile = () => {
    navigator.clipboard.writeText(generateClaudeProfile());
    setCopiedProfile(true);
    setTimeout(() => setCopiedProfile(false), 2000);
  };

  // ---- LANDING PAGE ----
  if (step === "landing") {
    return (
      <div className="min-h-screen">
        {/* Hero */}
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-16">
          <div className="text-center animate-fade-in">
            {/* Claude Logo/Mark */}
            <div className="inline-flex items-center gap-2 bg-white/80 border border-[#E8734A]/20 rounded-full px-4 py-2 mb-8 text-sm text-[#1A1A1A]/70">
              <Sparkles className="w-4 h-4 text-[#E8734A]" />
              Free migration tool â no sign-up required
            </div>

            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-[#1A1A1A] mb-6 leading-[1.1]">
              Switch to{" "}
              <span className="text-[#E8734A]">Claude</span>
            </h1>

            <p className="text-xl sm:text-2xl text-[#1A1A1A]/60 max-w-2xl mx-auto mb-12 leading-relaxed">
              Migrate your AI conversations, context, and preferences from ChatGPT, Gemini, Copilot, or Perplexity â in minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setStep("select-source")}
                className="group flex items-center gap-3 bg-[#E8734A] hover:bg-[#D4633A] text-white px-8 py-4 rounded-full text-lg font-medium transition-all hover:scale-[1.02] active:scale-[0.98] pulse-glow"
              >
                Start Migration
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => setStep("select-source")}
                className="flex items-center gap-2 text-[#1A1A1A]/50 hover:text-[#1A1A1A]/80 px-6 py-4 text-lg transition-colors"
              >
                See how it works
              </button>
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
            {[
              {
                icon: <Upload className="w-6 h-6" />,
                title: "Import Conversations",
                desc: "Upload your chat export and we'll parse every conversation, topic, and preference.",
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: "Analyze Your Usage",
                desc: "See how you've used AI â your top topics, communication style, and expertise areas.",
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Set Up Claude",
                desc: "Get a personalized Claude profile and learn which features match your workflow.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 border border-[#1A1A1A]/5 hover:border-[#E8734A]/20 transition-colors"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-[#E8734A]/10 text-[#E8734A] flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-[#1A1A1A]/50 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div className="text-center mt-24 text-[#1A1A1A]/40 text-sm">
            <p>Join thousands of people making the switch to Claude</p>
            <div className="flex items-center justify-center gap-8 mt-4">
              {services.map((s) => (
                <span key={s.id} className="flex items-center gap-2 text-base">
                  <span>{s.icon}</span>
                  <span>{s.name}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- WIZARD WRAPPER ----
  const progress =
    step === "select-source" ? 1 :
    step === "export-guide" ? 2 :
    step === "upload" ? 3 :
    step === "analyzing" ? 3.5 :
    step === "results" ? 4 :
    step === "claude-setup" ? 5 :
    step === "complete" ? 6 : 0;

  const totalSteps = 6;

  return (
    <div className="min-h-screen">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-[#1A1A1A]/5">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => {
              if (step === "select-source") setStep("landing");
              else if (step === "export-guide") setStep("select-source");
              else if (step === "upload") setStep("export-guide");
              else if (step === "results") setStep("upload");
              else if (step === "claude-setup") setStep("results");
              else if (step === "complete") setStep("claude-setup");
            }}
            className="flex items-center gap-2 text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#1A1A1A]/40">
              Step {Math.ceil(progress)} of {totalSteps}
            </span>
            <div className="w-32 h-1.5 bg-[#1A1A1A]/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#E8734A] rounded-full transition-all duration-500"
                style={{ width: `${(progress / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-24 pb-16">
        {/* ---- SELECT SOURCE ---- */}
        {step === "select-source" && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold mb-2">Where are you migrating from?</h2>
            <p className="text-[#1A1A1A]/50 mb-8">
              Select the AI service you want to migrate away from.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => {
                    setSelectedService(service.id);
                    setStep("export-guide");
                  }}
                  className={`group text-left p-6 rounded-2xl border-2 transition-all hover:scale-[1.01] active:scale-[0.99] ${
                    selectedService === service.id
                      ? "border-[#E8734A] bg-[#E8734A]/5"
                      : "border-[#1A1A1A]/5 bg-white hover:border-[#E8734A]/30"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{service.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{service.name}</h3>
                      <p className="text-sm text-[#1A1A1A]/50">{service.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm text-[#E8734A] opacity-0 group-hover:opacity-100 transition-opacity">
                    Select & continue <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ---- EXPORT GUIDE ---- */}
        {step === "export-guide" && selectedService && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{services.find((s) => s.id === selectedService)?.icon}</span>
              <h2 className="text-3xl font-bold">
                Export from {services.find((s) => s.id === selectedService)?.name}
              </h2>
            </div>
            <p className="text-[#1A1A1A]/50 mb-8">
              Follow these steps to download your data. Don&apos;t worry â we never see your data, everything is processed in your browser.
            </p>

            <div className="bg-white rounded-2xl border border-[#1A1A1A]/5 overflow-hidden">
              {exportGuides[selectedService].steps.map((s, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-5 border-b border-[#1A1A1A]/5 last:border-0"
                >
                  <div className="w-8 h-8 rounded-full bg-[#E8734A]/10 text-[#E8734A] flex items-center justify-center text-sm font-semibold shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-[#1A1A1A]/80 pt-1">{s}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-[#E8734A]/5 rounded-xl border border-[#E8734A]/10">
              <p className="text-sm text-[#1A1A1A]/60">
                <span className="font-medium text-[#E8734A]">Note: </span>
                {exportGuides[selectedService].notes}
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={() => setShowSkipOption(!showSkipOption)}
                className="text-sm text-[#1A1A1A]/40 hover:text-[#1A1A1A]/60 transition-colors flex items-center gap-1"
              >
                Don&apos;t have your export? <ChevronDown className={`w-4 h-4 transition-transform ${showSkipOption ? "rotate-180" : ""}`} />
              </button>
              <button
                onClick={() => setStep("upload")}
                className="flex items-center gap-2 bg-[#E8734A] hover:bg-[#D4633A] text-white px-6 py-3 rounded-full font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                I have my export <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {showSkipOption && (
              <div className="mt-4 p-4 bg-white rounded-xl border border-[#1A1A1A]/5 animate-fade-in">
                <p className="text-sm text-[#1A1A1A]/60 mb-3">
                  No worries! You can skip the data import and jump straight to setting up Claude with our guided setup.
                </p>
                <button
                  onClick={() => setStep("claude-setup")}
                  className="text-sm text-[#E8734A] hover:text-[#D4633A] font-medium flex items-center gap-1"
                >
                  Skip to Claude setup <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ---- UPLOAD ---- */}
        {step === "upload" && selectedService && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold mb-2">Upload your data</h2>
            <p className="text-[#1A1A1A]/50 mb-8">
              Drop your exported file here. Everything is processed locally in your browser â nothing is sent to any server.
            </p>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-[#E8734A] bg-[#E8734A]/5"
                  : "border-[#1A1A1A]/10 hover:border-[#E8734A]/30 bg-white"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.zip,.txt,.csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />
              <FileJson className="w-12 h-12 text-[#E8734A]/40 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">
                {isDragging ? "Drop it here!" : "Drag & drop your export file"}
              </p>
              <p className="text-sm text-[#1A1A1A]/40">
                or click to browse â accepts {exportGuides[selectedService].fileType}
              </p>
            </div>

            <div className="mt-8 p-5 bg-white rounded-2xl border border-[#1A1A1A]/5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Your data stays private</h4>
                  <p className="text-sm text-[#1A1A1A]/50">
                    All processing happens in your browser. Your conversations are never uploaded to any server. We can&apos;t see your data â that&apos;s by design.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---- ANALYZING ---- */}
        {step === "analyzing" && (
          <div className="animate-fade-in text-center py-20">
            <div className="w-16 h-16 rounded-full bg-[#E8734A]/10 flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Sparkles className="w-8 h-8 text-[#E8734A]" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Analyzing your conversations...</h2>
            <p className="text-[#1A1A1A]/50">
              Parsing messages, extracting topics, and building your profile.
            </p>
            <div className="mt-8 w-48 h-1.5 bg-[#1A1A1A]/5 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-[#E8734A] rounded-full animate-pulse w-2/3" />
            </div>
          </div>
        )}

        {/* ---- RESULTS ---- */}
        {step === "results" && analysis && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold mb-2">Your AI History</h2>
            <p className="text-[#1A1A1A]/50 mb-8">
              Here&apos;s what we found in your {services.find((s) => s.id === selectedService)?.name} data.
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Conversations", value: analysis.totalConversations.toLocaleString() },
                { label: "Messages", value: analysis.totalMessages.toLocaleString() },
                { label: "Topics", value: analysis.topTopics.length.toString() },
                { label: "Date range", value: analysis.dateRange.split(" â ")[0] || "â" },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-[#1A1A1A]/5 text-center">
                  <p className="text-2xl font-bold text-[#E8734A]">{stat.value}</p>
                  <p className="text-xs text-[#1A1A1A]/40 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Topics */}
            <div className="bg-white rounded-2xl p-6 border border-[#1A1A1A]/5 mb-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#E8734A]" />
                Top Topics
              </h3>
              <div className="space-y-3">
                {analysis.conversationCategories.slice(0, 6).map((cat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-sm text-[#1A1A1A]/60 w-24 shrink-0">{cat.category}</span>
                    <div className="flex-1 h-6 bg-[#1A1A1A]/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#E8734A]/20 rounded-full flex items-center px-3"
                        style={{ width: `${Math.max(cat.percentage, 10)}%` }}
                      >
                        <span className="text-xs font-medium text-[#E8734A]">
                          {cat.count} ({cat.percentage}%)
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* User profile summary */}
            <div className="bg-white rounded-2xl p-6 border border-[#1A1A1A]/5 mb-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[#E8734A]" />
                Your AI User Profile
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#1A1A1A]/40 uppercase tracking-wide mb-2">Interests</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.userProfile.interests.map((interest, i) => (
                      <span key={i} className="bg-[#E8734A]/10 text-[#E8734A] text-sm px-3 py-1 rounded-full">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[#1A1A1A]/40 uppercase tracking-wide mb-2">Communication Style</p>
                  <p className="text-sm text-[#1A1A1A]/70">{analysis.userProfile.communicationStyle}</p>
                </div>
              </div>
            </div>

            {/* Top conversations */}
            <div className="bg-white rounded-2xl p-6 border border-[#1A1A1A]/5 mb-8">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#E8734A]" />
                Top Conversations
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {analysis.conversations.slice(0, 10).map((conv, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#1A1A1A]/[0.02]">
                    <span className="text-xs text-[#1A1A1A]/30 mt-1 w-4">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{conv.title}</p>
                      <p className="text-xs text-[#1A1A1A]/40">{conv.messageCount} messages Â· {conv.dateRange}</p>
                    </div>
                    <div className="flex gap-1">
                      {conv.topics.slice(0, 2).map((t, j) => (
                        <span key={j} className="text-[10px] bg-[#1A1A1A]/5 px-2 py-0.5 rounded-full text-[#1A1A1A]/40">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep("claude-setup")}
              className="w-full flex items-center justify-center gap-2 bg-[#E8734A] hover:bg-[#D4633A] text-white px-6 py-4 rounded-full font-medium text-lg transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              Set up Claude with my profile <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* ---- CLAUDE SETUP ---- */}
        {step === "claude-setup" && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold mb-2">Set Up Claude</h2>
            <p className="text-[#1A1A1A]/50 mb-8">
              Here&apos;s how to get the most out of Claude, tailored to your usage patterns.
            </p>

            {/* Generated profile */}
            {analysis && (
              <div className="bg-white rounded-2xl p-6 border border-[#1A1A1A]/5 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <User className="w-5 h-5 text-[#E8734A]" />
                    Your Claude Profile
                  </h3>
                  <button
                    onClick={copyProfile}
                    className="flex items-center gap-2 text-sm text-[#E8734A] hover:text-[#D4633A] transition-colors"
                  >
                    {copiedProfile ? (
                      <>
                        <Check className="w-4 h-4" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" /> Copy to clipboard
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-[#FAF7F2] rounded-xl p-4 text-sm text-[#1A1A1A]/70 whitespace-pre-wrap font-mono leading-relaxed">
                  {generateClaudeProfile()}
                </div>
                <p className="text-xs text-[#1A1A1A]/40 mt-3">
                  Paste this into your first conversation with Claude to give it context about how you work.
                </p>
              </div>
            )}

            {/* Claude features guide */}
            <div className="space-y-4 mb-8">
              <h3 className="font-semibold text-lg">Recommended Claude Features</h3>

              {[
                {
                  icon: <FolderOpen className="w-5 h-5" />,
                  title: "Projects",
                  desc: "Organize your work into Projects with persistent context. Add files, set custom instructions, and keep everything in one place.",
                  link: "https://claude.ai",
                  tip: analysis?.topTopics[0]
                    ? `Based on your ${analysis.topTopics[0]} usage, try creating a "${analysis.topTopics[0]}" project.`
                    : "Try creating a project for your most common workflow.",
                },
                {
                  icon: <BookOpen className="w-5 h-5" />,
                  title: "Custom Instructions",
                  desc: "Tell Claude how you like to communicate. Set your preferred response style, expertise level, and formatting preferences.",
                  link: "https://claude.ai",
                  tip: analysis
                    ? `Your style is "${analysis.userProfile.communicationStyle}" â set that in your custom instructions.`
                    : "Set your preferred communication style and expertise level.",
                },
                {
                  icon: <Sparkles className="w-5 h-5" />,
                  title: "Artifacts",
                  desc: "Claude can create interactive code, documents, and visualizations right in the conversation. Great for iterating on work.",
                  link: "https://claude.ai",
                  tip: analysis?.topTopics.includes("Programming")
                    ? "You code a lot â try asking Claude to create artifacts for your code snippets."
                    : "Ask Claude to create documents, code, or visualizations as artifacts.",
                },
                {
                  icon: <Zap className="w-5 h-5" />,
                  title: "Claude Code",
                  desc: "An agentic coding tool that lives in your terminal. Let Claude write, edit, and run code directly in your codebase.",
                  link: "https://docs.claude.com/en/docs/claude-code",
                  tip: "Perfect for developers who want AI that can actually ship code.",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-[#1A1A1A]/5 hover:border-[#E8734A]/20 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#E8734A]/10 text-[#E8734A] flex items-center justify-center shrink-0">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{feature.title}</h4>
                        <a
                          href={feature.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#E8734A] hover:text-[#D4633A]"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      <p className="text-sm text-[#1A1A1A]/50 mb-2">{feature.desc}</p>
                      <p className="text-sm text-[#E8734A]/80 bg-[#E8734A]/5 px-3 py-1.5 rounded-lg inline-block">
                        ð¡ {feature.tip}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep("complete")}
              className="w-full flex items-center justify-center gap-2 bg-[#E8734A] hover:bg-[#D4633A] text-white px-6 py-4 rounded-full font-medium text-lg transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              Complete Migration <CheckCircle2 className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* ---- COMPLETE ---- */}
        {step === "complete" && (
          <div className="animate-fade-in text-center py-12">
            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold mb-3">Welcome to Claude!</h2>
            <p className="text-lg text-[#1A1A1A]/50 max-w-lg mx-auto mb-8">
              You&apos;re all set. Your AI migration is complete and you&apos;re ready to start using Claude.
            </p>

            {analysis && (
              <div className="bg-white rounded-2xl p-6 border border-[#1A1A1A]/5 text-left mb-8 max-w-md mx-auto">
                <h3 className="font-semibold mb-4 text-center">Migration Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#1A1A1A]/50">Conversations analyzed</span>
                    <span className="font-medium">{analysis.totalConversations.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#1A1A1A]/50">Messages processed</span>
                    <span className="font-medium">{analysis.totalMessages.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#1A1A1A]/50">Topics identified</span>
                    <span className="font-medium">{analysis.topTopics.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#1A1A1A]/50">Profile generated</span>
                    <span className="font-medium text-green-600">â Ready</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://claude.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#E8734A] hover:bg-[#D4633A] text-white px-8 py-4 rounded-full font-medium text-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Open Claude <ExternalLink className="w-5 h-5" />
              </a>
              <button
                onClick={() => {
                  setStep("landing");
                  setSelectedService(null);
                  setAnalysis(null);
                }}
                className="text-[#1A1A1A]/40 hover:text-[#1A1A1A]/60 transition-colors px-6 py-4"
              >
                Start over
              </button>
            </div>

            <div className="mt-12 p-6 bg-[#E8734A]/5 rounded-2xl border border-[#E8734A]/10 max-w-lg mx-auto">
              <p className="text-sm text-[#1A1A1A]/60 mb-3">
                <span className="font-medium text-[#E8734A]">Pro tip:</span> Paste your generated profile into your first Claude conversation to hit the ground running.
              </p>
              {analysis && (
                <button
                  onClick={copyProfile}
                  className="flex items-center gap-2 text-sm text-[#E8734A] hover:text-[#D4633A] font-medium mx-auto transition-colors"
                >
                  {copiedProfile ? (
                    <>
                      <Check className="w-4 h-4" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copy profile to clipboard
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
