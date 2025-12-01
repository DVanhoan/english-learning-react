// Mock data for TOEIC Listening practice tests
export const mockPracticeTests = [
  {
    id: "practice-test-1",
    title: "Practice Test 1",
    lessonCount: 20,
    lessons: [
      {
        id: "conversation-1",
        title: "Conversation 1",
        subtitle: "Office Copier Breakdown",
        parts: 17,
        vocabLevel: "B1",
        type: "Conversation" as const,
      },
      {
        id: "conversation-2",
        title: "Conversation 2",
        subtitle: "Production Manager Transition Plans",
        parts: 19,
        vocabLevel: "B2",
        type: "Conversation" as const,
      },
      {
        id: "conversation-3",
        title: "Conversation 3",
        subtitle: "Dropping Off Documents",
        parts: 13,
        vocabLevel: "A2",
        type: "Conversation" as const,
      },
      {
        id: "conversation-4",
        title: "Conversation 4",
        subtitle: "Dental Claim Status Inquiry",
        parts: 10,
        vocabLevel: "B1",
        type: "Conversation" as const,
      },
      {
        id: "conversation-5",
        title: "Conversation 5",
        subtitle: "Delayed Computer Delivery Call",
        parts: 15,
        vocabLevel: "B1",
        type: "Conversation" as const,
      },
      {
        id: "conversation-6",
        title: "Conversation 6",
        subtitle: "Airport Check-in Frustrations",
        parts: 9,
        vocabLevel: "B1",
        type: "Conversation" as const,
      },
      {
        id: "conversation-7",
        title: "Conversation 7",
        subtitle: "Minimalist Design Workshop Invitation",
        parts: 19,
        vocabLevel: "B1",
        type: "Conversation" as const,
      },
      {
        id: "conversation-8",
        title: "Conversation 8",
        subtitle: "Request for Earlier Appointment",
        parts: 12,
        vocabLevel: "B1",
        type: "Conversation" as const,
      },
      {
        id: "conversation-9",
        title: "Conversation 9",
        subtitle: "Returning Tight Shoes",
        parts: 12,
        vocabLevel: "B1",
        type: "Conversation" as const,
      },
      {
        id: "conversation-10",
        title: "Conversation 10",
        subtitle: "Rental Car Damage Inquiry",
        parts: 15,
        vocabLevel: "B1",
        type: "Conversation" as const,
      },
      {
        id: "short-talk-1",
        title: "Short Talk 1",
        subtitle: "Snowstorm Traffic Update",
        parts: 13,
        vocabLevel: "B1",
        type: "Short Talk" as const,
      },
      {
        id: "short-talk-2",
        title: "Short Talk 2",
        subtitle: "Country Fair Raffle Event",
        parts: 11,
        vocabLevel: "B1",
        type: "Short Talk" as const,
      },
      {
        id: "short-talk-3",
        title: "Short Talk 3",
        subtitle: "Introducing the L-Shaped Sofa",
        parts: 10,
        vocabLevel: "B1",
        type: "Short Talk" as const,
      },
      {
        id: "short-talk-4",
        title: "Short Talk 4",
        subtitle: "Dentist Appointment Reminder",
        parts: 8,
        vocabLevel: "B1",
        type: "Short Talk" as const,
      },
      {
        id: "short-talk-5",
        title: "Short Talk 5",
        subtitle: "Fitness Expo Agenda Update",
        parts: 9,
        vocabLevel: "B1",
        type: "Short Talk" as const,
      },
      {
        id: "short-talk-6",
        title: "Short Talk 6",
        subtitle: "User Experience Conference Opening",
        parts: 11,
        vocabLevel: "B1",
        type: "Short Talk" as const,
      },
      {
        id: "short-talk-7",
        title: "Short Talk 7",
        subtitle: "National Portrait Gallery Tour",
        parts: 12,
        vocabLevel: "B1",
        type: "Short Talk" as const,
      },
      {
        id: "short-talk-8",
        title: "Short Talk 8",
        subtitle: "Plumbing Issues Discovered",
        parts: 11,
        vocabLevel: "B1",
        type: "Short Talk" as const,
      },
      {
        id: "short-talk-9",
        title: "Short Talk 9",
        subtitle: "Family Marketing Success at Cheshire",
        parts: 8,
        vocabLevel: "B1",
        type: "Short Talk" as const,
      },
      {
        id: "short-talk-10",
        title: "Short Talk 10",
        subtitle: "Missing Receipt Reminder",
        parts: 10,
        vocabLevel: "B1",
        type: "Short Talk" as const,
      },
    ],
  },
  {
    id: "practice-test-2",
    title: "Practice Test 2",
    lessonCount: 20,
    lessons: [],
  },
  {
    id: "practice-test-3",
    title: "Practice Test 3",
    lessonCount: 20,
    lessons: [],
  },
  {
    id: "practice-test-4",
    title: "Practice Test 4",
    lessonCount: 20,
    lessons: [],
  },
];

export const mockRootProps = {
  searchTerm: "",
  selectedLevel: "All levels",
};

// Type definitions
export interface DictationLesson {
  id: string;
  title: string;
  subtitle: string;
  parts: number;
  vocabLevel: string;
  type: "Conversation" | "Short Talk";
}

export interface PracticeTest {
  id: string;
  title: string;
  lessonCount: number;
  lessons: DictationLesson[];
}
