import type { RouteObject } from "react-router-dom";
import routes from "./routes.const";
import MainLayout from "@/layouts/MainLayout";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import Courses from "@/pages/Courses";
import CourseDetail from "@/pages/CourseDetail";
import Posts from "@/pages/Posts";
import PostDetail from "@/pages/PostDetail";
import Lesson from "@/pages/Lesson";
import Flashcards from "@/pages/Flashcards";
import MyFlashcards from "@/pages/MyFlashcards";
import Orders from "@/pages/Orders";
import FlashcardDetail from "@/pages/FlashcardDetail";
import CreateFlashcard from "@/pages/CreateFlashcard";
import Cart from "@/pages/Cart";
import DictationTopics from "@/pages/DictationTopics";
import DictationLessons from "@/pages/DictationLessons";
import DictationLessonDetail from "@/pages/DictationLessonDetail";
import CreatePassword from "@/pages/CreatePassword";
import Checkout from "@/pages/Checkout";
import PaymentResult from "@/pages/PaymentResult";
import MyCourses from "@/pages/MyCourses";
import SpeakingLobby from "@/pages/SpeakingLobby";
import SpeakingRoom from "@/pages/SpeakingRoom";
import AITutor from "@/pages/AITutor/AITutor";


const PublicRoutes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      { path: routes.HOME, element: <Home /> },
      { path: routes.CREATE_PASSWORD, element: <CreatePassword /> },
      { path: routes.COURSES, element: <Courses /> },
      { path: routes.COURSE_DETAIL, element: <CourseDetail /> },
      { path: routes.POSTS, element: <Posts /> },
      { path: routes.POST_DETAIL, element: <PostDetail /> },
      { path: routes.NOT_FOUND, element: <NotFound /> },
      { path: routes.FLASHCARDS, element: <Flashcards /> },
      { path: routes.FLASHCARD_DETAIL, element: <FlashcardDetail /> },
      { path: routes.CREATE_FLASHCARD, element: <CreateFlashcard /> },
      { path: routes.EDIT_FLASHCARD, element: <CreateFlashcard /> },
      { path: routes.MY_FLASHCARDS, element: <MyFlashcards /> },
      { path: routes.ORDERS, element: <Orders /> },
      { path: routes.CART, element: <Cart /> },
      { path: routes.MY_COURSES, element: <MyCourses /> },
      { path: routes.CHECKOUT, element: <Checkout />, },
      { path: routes.PAYMENT_RESULT, element: <PaymentResult />, },
      { path: routes.DICTATION_TOPICS, element: <DictationTopics /> },
      { path: routes.DICTATION_LESSONS, element: <DictationLessons /> },
      { path: "*", element: <NotFound /> },
      { path: routes.DICTATION_LESSON_DETAIL, element: <DictationLessonDetail /> },
      { path: routes.SPEAKING_LOBBY, element: <SpeakingLobby /> },
    ],
  },
  {
    element: <MainLayout showFooter={false} />,
    children: [
      { path: routes.VIDEO_LESSON, element: <Lesson /> },
      { path: routes.AI_TUTOR, element: <AITutor /> },
    ],
  },
  { path: routes.SPEAKING_ROOM, element: <SpeakingRoom /> },
];

export default PublicRoutes;
