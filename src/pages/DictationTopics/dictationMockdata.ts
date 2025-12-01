// Mock data for dictation topics and lessons

// Topic categories and difficulty levels
export type DictationCategory =
  | "Short Stories"
  | "Conversations"
  | "Stories for Kids"
  | "TOEIC Listening"
  | "IELTS Listening"
  | "Random Videos"
  | "News"
  | "TED"
  | "TOEFL Listening";

export type DictationLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type DictationDifficulty = "Easy" | "Medium" | "Hard";

// Types for dictation topics and lessons
export interface DictationTopic {
  id: string;
  title: string;
  category: string;
  description: string;
  thumbnail: string;
  levelRange: string;
  lessonCount: number;
  difficulty: "Easy" | "Medium" | "Hard";
  hasVideo: boolean;
}

export interface DictationLesson {
  id: string;
  title: string;
  subtitle: string;
  parts: number;
  vocabLevel: string;
  type: "Conversation" | "Short Talk";
}

export interface DictationPracticeTest {
  id: string;
  title: string;
  type: "Practice Test";
  lessonCount: number;
  isExpanded: boolean;
  lessons: DictationLesson[];
}

// Mock data for dictation topics
export const mockDictationTopics: DictationTopic[] = [
  {
    id: "short-stories",
    title: "Short Stories",
    category: "Short Stories",
    description:
      "A collection of audio articles introducing culture, people, places, historical events and daily life in English-speaking countries, especially Canada and America.",
    thumbnail:
      "https://images.unsplash.com/photo-1623771702313-39dc4f71d275?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwzfHxib29rcyUyMGxpYnJhcnklMjByZWFkaW5nfGVufDB8MHx8fDE3NTc2NzQ5MTF8MA&ixlib=rb-4.1.0&q=85",
    levelRange: "A1-C1",
    lessonCount: 289,
    difficulty: "Easy",
    hasVideo: false,
  },
  {
    id: "conversations",
    title: "Conversations",
    category: "Conversations",
    description:
      "Short and fun English conversations in common situations you may experience in daily life. You will learn casual phrases & expressions that native speakers use.",
    thumbnail:
      "https://images.unsplash.com/photo-1615363366457-55b0a8672fef?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHxwZW9wbGUlMjB0YWxraW5nJTIwY29udmVyc2F0aW9ufGVufDB8MHx8fDE3NTc2NzQ5MTF8MA&ixlib=rb-4.1.0&q=85",
    levelRange: "A1-B1",
    lessonCount: 100,
    difficulty: "Easy",
    hasVideo: false,
  },
  {
    id: "stories-for-kids",
    title: "Stories for Kids",
    category: "Stories for Kids",
    description:
      "Learn English through famous fairy tales and stories for children.",
    thumbnail:
      "https://images.unsplash.com/flagged/photo-1571108950669-06e6633c4496?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw0fHxjaGlsZHJlbiUyMGJvb2tzJTIwZmFpcnklMjB0YWxlc3xlbnwwfDB8fHwxNzU3Njc0OTExfDA&ixlib=rb-4.1.0&q=85",
    levelRange: "A2-B2",
    lessonCount: 13,
    difficulty: "Easy",
    hasVideo: true,
  },
  {
    id: "toeic-listening",
    title: "TOEIC Listening",
    category: "TOEIC Listening",
    description:
      "In this section, there are a lot of conversations and short talks in everyday life and at work. Let's practice and improve your English communication skills!",
    thumbnail:
      "https://images.unsplash.com/photo-1650525218265-d6fef4ada666?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwzfHxzdHVkeSUyMGV4YW0lMjBidXNpbmVzc3xlbnwwfDB8fHwxNzU3Njc0OTExfDA&ixlib=rb-4.1.0&q=85",
    levelRange: "A2-C1",
    lessonCount: 600,
    difficulty: "Medium",
    hasVideo: false,
  },
  {
    id: "ielts-listening",
    title: "IELTS Listening",
    category: "IELTS Listening",
    description:
      "Listening to IELTS recordings will help you learn a lot of vocabulary and expressions about everyday conversations & academic talks. These recordings are mainly in British and Australian accents.",
    thumbnail:
      "https://images.unsplash.com/photo-1606479067834-db5efd9f2fe9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw1fHx1bml2ZXJzaXR5JTIwYWNhZGVtaWMlMjBleGFtfGVufDB8MHx8fDE3NTc2NzQ5MTF8MA&ixlib=rb-4.1.0&q=85",
    levelRange: "B1-C1",
    lessonCount: 344,
    difficulty: "Hard",
    hasVideo: false,
  },
  {
    id: "random-videos",
    title: "Random Videos",
    category: "Random Videos",
    description:
      "Are you bored with English lessons for students? Let's learn real English from YouTube videos that native speakers watch and enjoy!",
    thumbnail:
      "https://images.unsplash.com/photo-1683201681321-1415b8794e73?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwzfHx5b3V0dWJlJTIwdmlkZW9zJTIwZW50ZXJ0YWlubWVudHxlbnwwfDB8fHwxNzU3Njc0OTExfDA&ixlib=rb-4.1.0&q=85",
    levelRange: "B1-C2",
    lessonCount: 181,
    difficulty: "Medium",
    hasVideo: true,
  },
  {
    id: "news",
    title: "News",
    category: "News",
    description:
      "Learn English through real-world news! Discover fascinating events and stories from around the globe while improving your language skills.",
    thumbnail:
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop",
    levelRange: "B1-C1",
    lessonCount: 202,
    difficulty: "Medium",
    hasVideo: true,
  },
  {
    id: "ted",
    title: "TED",
    category: "TED",
    description:
      "Dive into fascinating topics from science, history, philosophy, and more while improving your English skills. Perfect for English learners who love exploring new ideas!",
    thumbnail:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop",
    levelRange: "C1-C2",
    lessonCount: 88,
    difficulty: "Hard",
    hasVideo: true,
  },
  {
    id: "toefl-listening",
    title: "TOEFL Listening",
    category: "TOEFL Listening",
    description:
      "TOEFL listening recordings are academic conversations & lectures. These recordings will help you to get better preparation if you are planning to study in a English-speaking country.",
    thumbnail:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=400&h=300&fit=crop",
    levelRange: "B1-C2",
    lessonCount: 54,
    difficulty: "Hard",
    hasVideo: false,
  },
];

export const mockTopicLessons: Record<string, DictationPracticeTest[]> = {
  "toeic-listening": [
    {
      id: "practice-test-1",
      title: "Practice Test 1",
      type: "Practice Test",
      lessonCount: 20,
      isExpanded: true,
      lessons: [
        {
          id: "conversation-1",
          title: "Conversation 1",
          subtitle: "Office Copier Breakdown",
          parts: 17,
          vocabLevel: "B1",
          type: "Conversation",
        },
        {
          id: "conversation-2",
          title: "Conversation 2",
          subtitle: "Production Manager Transition Plans",
          parts: 19,
          vocabLevel: "B2",
          type: "Conversation",
        },
        {
          id: "conversation-3",
          title: "Conversation 3",
          subtitle: "Dropping Off Documents",
          parts: 13,
          vocabLevel: "A2",
          type: "Conversation",
        },
        {
          id: "conversation-4",
          title: "Conversation 4",
          subtitle: "Dental Claim Status Inquiry",
          parts: 10,
          vocabLevel: "B1",
          type: "Conversation",
        },
        {
          id: "short-talk-1",
          title: "Short Talk 1",
          subtitle: "Snowstorm Traffic Update",
          parts: 13,
          vocabLevel: "B1",
          type: "Short Talk",
        },
        {
          id: "short-talk-2",
          title: "Short Talk 2",
          subtitle: "Country Fair Raffle Event",
          parts: 11,
          vocabLevel: "B1",
          type: "Short Talk",
        },
        {
          id: "short-talk-3",
          title: "Short Talk 3",
          subtitle: "Introducing the L-Shaped Sofa",
          parts: 10,
          vocabLevel: "B1",
          type: "Short Talk",
        },
      ],
    },
    {
      id: "practice-test-2",
      title: "Practice Test 2",
      type: "Practice Test",
      lessonCount: 20,
      isExpanded: false,
      lessons: [],
    },
    {
      id: "practice-test-3",
      title: "Practice Test 3",
      type: "Practice Test",
      lessonCount: 20,
      isExpanded: false,
      lessons: [],
    },
    {
      id: "practice-test-4",
      title: "Practice Test 4",
      type: "Practice Test",
      lessonCount: 20,
      isExpanded: false,
      lessons: [],
    },
  ],
};

// Format level ranges and lesson counts
export const formatLevelRange = (
  minLevel: string,
  maxLevel: string
): string => {
  return `${minLevel}-${maxLevel}`;
};

export const formatLessonCount = (count: number): string => {
  return `${count} lessons`;
};

export const formatPartsCount = (count: number): string => {
  return `${count} parts`;
};

export const formatVocabLevel = (level: string): string => {
  return `Vocab level: ${level}`;
};
