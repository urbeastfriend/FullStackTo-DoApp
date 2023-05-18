import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { Task as TaskModel } from './models/task';
import Task from './components/Task';
import styles from "./styles/TasksPage.module.css"
import styleUtils from "./styles/utils.module.css"
import * as TasksApi from "./network/tasks_api";
import AddTaskDialog from './components/AddTaskDialog';

function App() {

  const [tasks, setTasks] = useState<TaskModel[]>([]);

  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);

  // Receives two args, first is a side effect function, second is a dependency array
  // each time variables inside dependency array change - use effect is triggered
  // in case of empty array - its triggered only once
  // in case array param is not specified - it will trigger every render (bad)
  useEffect(() => {
    async function loadTasks(){
      try {
        const tasks = await TasksApi.fetchTasks();
        setTasks(tasks);
      } catch (error) {
        console.error(error);
        alert(error);
      }
    }
    loadTasks();
  }, [])

  return (
    <Container>
      <Button className={`${styleUtils.blockCenter} ${styles.addTaskButton} mb-3`}>
        Add new Task
      </Button>
      <Row xs={1} md={2} xl={3} className='g-4'>
      {tasks.map(task => (
        <Col key={task._id}>
        <Task task={task} className={styles.task}/>
        </Col>
      ))}
      </Row>
      {/* && means dialog will only be shows if condition == true
      also we could instead pass boolean as property and use it as value for show property in modal
      difference is then dialog will save its input after we close the dialog
      but here we want to clear all input as we close the dialog
      */}
      { showAddTaskDialog &&
        <AddTaskDialog 
        onDismiss={() => setShowAddTaskDialog(false)}
        onTaskSaved={(newTask) => {
          setTasks([...tasks,newTask]);
          setShowAddTaskDialog(false);
        }}
        />
      }
    </Container>
  );
}

export default App;
