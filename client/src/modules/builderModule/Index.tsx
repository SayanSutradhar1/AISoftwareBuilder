import { Routes, Route } from 'react-router-dom';
import BuilderLayout from './BuilderLayout';
import WelcomeScreen from './WelcomeScreen';
import SystemDesignFormWrapper from './SystemDesignFormWrapper';
import SystemDesignResultWrapper from './SystemDesignResultWrapper';

export default function BuilderModule() {
  return (
    <Routes>
      <Route element={<BuilderLayout />}>
        <Route path="" element={<WelcomeScreen />} />
        <Route path="new" element={<SystemDesignFormWrapper />} />
        <Route path=":id" element={<SystemDesignResultWrapper />} />
        <Route path=":id/playground" element={<SystemDesignResultWrapper isPlayground={true} />} />
      </Route>
    </Routes>
  );
}

