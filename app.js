// Will be configured after setting up Amplify
let amplifyConfig = {};

// Initialize Amplify (will add config later)
function initializeAmplify() {
    window.Amplify.configure(amplifyConfig);
}

// GraphQL operations
const createTodoMutation = `
    mutation CreateTodo($input: CreateTodoInput!) {
        createTodo(input: $input) {
            id
            name
            description
            completed
            createdAt
        }
    }
`;

const listTodosQuery = `
    query ListTodos {
        listTodos {
            items {
                id
                name
                description
                completed
                createdAt
            }
        }
    }
`;

async function createTodo() {
    const todoInput = {
        name: "Sample Todo " + Date.now(),
        description: "Created from browser",
        completed: false
    };

    try {
        const result = await window.Amplify.API.graphql({
            query: createTodoMutation,
            variables: { input: todoInput }
        });
        console.log('Todo created:', result);
        fetchTodos();
    } catch (error) {
        console.error('Error creating todo:', error);
    }
}

async function fetchTodos() {
    try {
        const result = await window.Amplify.API.graphql({
            query: listTodosQuery
        });
        
        const todos = result.data.listTodos.items;
        document.getElementById('content').innerHTML = 
            todos.map(todo => `
                <div style="border: 1px solid #ccc; margin: 10px; padding: 10px;">
                    <h3>${todo.name}</h3>
                    <p>${todo.description}</p>
                    <p>Completed: ${todo.completed}</p>
                    <small>Created: ${todo.createdAt}</small>
                </div>
            `).join('');
    } catch (error) {
        console.error('Error fetching todos:', error);
        document.getElementById('content').innerHTML = 'Error loading todos';
    }
}

// Initialize when page loads
window.onload = function() {
    initializeAmplify();
    fetchTodos();
};