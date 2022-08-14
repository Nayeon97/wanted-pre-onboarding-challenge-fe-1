import React, { useEffect, useState } from 'react';
import { instance } from '../../api/index';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { loginState } from '../../common/atom';
import TodoListCard from '../../components/molecules/todo/TodoListCard';
import TodoAdd from '../../components/molecules/todo/TodoAdd';
import { useNavigate } from 'react-router-dom';
import TodoHeader from '../../components/molecules/todo/TodoHeader';
import Template from '../../components/templates/Template';
import SnackBar from '../../components/atoms/SnackBar';

interface TodoTypes {
  title: string;
  content: string;
  id: string;
  createdAt: string;
  updatedAt: string;
}

const TodoList = () => {
  const [todoList, setTodoList] = useState<TodoTypes[]>([]);
  const navigate = useNavigate();
  const checkLoginState = useRecoilValue(loginState);

  useEffect(() => {
    if (!checkLoginState) {
      SnackBar('로그인 후 이용해주세요.', 'sucess');
      navigate('/');
    } else {
      getTodo();
    }
  }, []);

  const getTodo = async () => {
    try {
      const res = await instance.get('/todos');
      setTodoList(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Template>
        <TodoHeader />
        <TodoListCardsContainer>
          {todoList.map((todo) => {
            return (
              <TodoListCard
                key={todo.id}
                id={todo.id}
                title={todo.title}
                date={todo.updatedAt}
              />
            );
          })}
        </TodoListCardsContainer>
        <TodoAdd />
      </Template>
    </>
  );
};

export default TodoList;

const TodoListCardsContainer = styled.div`
  height: 400px;
  padding: 5px;
  overflow: scroll;
  overflow-x: hidden;
  margin-bottom: 10px;
`;
