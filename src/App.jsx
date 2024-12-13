import './App.css';
import TodoInput from './components/TodoInput/TodoInput';
import TodoList from './components/TodoList/TodoList';
import { TaskProvider } from './store/TaskContext';

function App() {
  return (
    <TaskProvider>
      <main className="content">
        <TodoInput />
        <TodoList />
      </main>
    </TaskProvider>
  );
}

export default App;
