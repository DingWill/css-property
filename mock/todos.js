export default {
  'get /todos': {
    errorCode: 200,
    success: true,
    data: [
      {
        id: 1,
        title: 'Learn Javascript',
        completed: true
      },
      {
        id: 2,
        title: 'Learn React',
        completed: false
      },
      {
        id: 3,
        title: 'Learn Ant-Design',
        completed: false
      }
    ],
    message: null
  },
  'post /todos': {
    errorCode: 200,
    success: true,
    message: null
  },
  'put /todos/edit/:id': {
    errorCode: 200,
    success: true,
    message: null
  },
  'delete /todos/:id': {
    errorCode: 200,
    success: true,
    message: null
  },
  'post /todos/clear': {
    errorCode: 200,
    success: true,
    message: null
  }
}
