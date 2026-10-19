package model

import "encoding/json"

type ChecklistItem struct {
	ID   int    `json:"id,omitempty"`
	Text string `json:"text"`
	Done bool   `json:"done"`
}

type StringOrSlice []string

func (s *StringOrSlice) UnmarshalJSON(data []byte) error {
	var single string
	if err := json.Unmarshal(data, &single); err == nil {
		*s = []string{single}
		return nil
	}
	var slice []string
	if err := json.Unmarshal(data, &slice); err == nil {
		*s = slice
		return nil
	}
	*s = []string{}
	return nil
}

type TaskItem struct {
	ID           string          `json:"id"`
	Division     string          `json:"division"`
	PIC          string          `json:"pic"`
	HandoverTo   string          `json:"handoverTo"`
	Title        string          `json:"title"`
	Category     string          `json:"category"`
	Service      string          `json:"service"`
	ServiceGroup string          `json:"serviceGroup"`
	CodeFile     string          `json:"codeFile"`
	CodeLang     string          `json:"codeLang"`
	Status       string          `json:"status"`
	Priority     string          `json:"priority"`
	Phase        string          `json:"phase"`
	Lead         string          `json:"lead"`
	FlowDesc     string          `json:"flowDesc"`
	FlowDiagram  string          `json:"flowDiagram"`
	Checklist    []ChecklistItem `json:"checklist"`
	CodeSnippet  string          `json:"codeSnippet"`
	AINotes      string          `json:"aiNotes"`
	DOD          StringOrSlice   `json:"dod"`
}

type ArchitectureBlueprint struct {
	Term          string   `json:"term"`
	Category      string   `json:"category"`
	Icon          string   `json:"icon"`
	Definition    string   `json:"definition"`
	Requirements  []string `json:"requirements"`
	FileReference string   `json:"fileReference"`
	CLICommand    string   `json:"cliCommand"`
	GuideSteps    []string `json:"guideSteps"`
	DoAndDont     string   `json:"doAndDont"`
}

type EnterpriseSOP struct {
	ID       string   `json:"id"`
	Title    string   `json:"title"`
	Category string   `json:"category"`
	PIC      string   `json:"pic"`
	Badge    string   `json:"badge"`
	Steps    []string `json:"steps"`
}

type TeamMember struct {
	ID              string `json:"id"`
	Name            string `json:"name"`
	Role            string `json:"role"`
	PIC             string `json:"pic"`
	Icon            string `json:"icon"`
	Handover        string `json:"handover"`
	Focus           string `json:"focus"`
	Responsibilities string `json:"responsibilities"`
}

type MicroserviceMeta struct {
	ID        string   `json:"id"`
	Name      string   `json:"name"`
	Path      string   `json:"path"`
	Stack     string   `json:"stack"`
	PIC       string   `json:"pic"`
	Icon      string   `json:"icon"`
	Lead      string   `json:"lead"`
	Mandates  []string `json:"mandates"`
	Forbidden []string `json:"forbidden"`
}

type TelemetryStats struct {
	TotalTasks      int `json:"totalTasks"`
	OngoingTasks    int `json:"ongoingTasks"`
	TotalServices   int `json:"totalServices"`
	TotalMembers    int `json:"totalMembers"`
	TotalBlueprints int `json:"totalBlueprints"`
	TotalSOPs       int `json:"totalSops"`
}

type ChecklistUpdateRequest struct {
	Index int  `json:"index"`
	Done  bool `json:"done"`
}
