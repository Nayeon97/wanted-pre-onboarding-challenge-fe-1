import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Input from '../../atoms/Input';
import Button from '../../atoms/Button';
import { nonTokenInstance } from '../../../api/index';
import { loginState } from '../../../common/atom';
import { useSetRecoilState } from 'recoil';

interface AccountTypes {
  email: string;
  password: string;
}

interface AccountProp {
  url: string;
  name: string;
}

const AccountForm = ({ url, name }: AccountProp) => {
  const setLoginState = useSetRecoilState(loginState);

  const [account, setAccount] = useState<AccountTypes>({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const checkEmail =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return checkEmail.test(email);
  };

  const isEmailValid = validateEmail(account.email);
  const isPasswordValid = account.password.length > 7;

  const isActive = isEmailValid && isPasswordValid;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccount({
      ...account,
      [name]: value,
    });
  };

  const onClick = async () => {
    if (url == 'create') {
      try {
        const res = await nonTokenInstance.post(`/users/${url}`, {
          email: account.email,
          password: account.password,
        });
        navigate('/signin');
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const res = await nonTokenInstance.post(`/users/${url}`, {
          email: account.email,
          password: account.password,
        });
        window.localStorage.setItem('token', res.data.token);
        setLoginState(true);
        navigate('/todolist');
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      <InputWrapper>
        <div>이메일</div>
        <Input
          type="email"
          name="email"
          value={account.email}
          onChange={onChange}
        />
        {!isEmailValid && <p>⚠️ 이메일 형식이 올바르지 않습니다.</p>}
      </InputWrapper>
      <InputWrapper>
        <div>비밀번호</div>
        <Input
          type="password"
          name="password"
          value={account.password}
          onChange={onChange}
        />
        {!isPasswordValid && <p>⚠️ 비밀번호는 8글자 이상입니다.</p>}
      </InputWrapper>

      <ButtonWrapper>
        <Button
          name={name}
          disabled={!isActive}
          onClick={onClick}
          btnType="submit"
        />
      </ButtonWrapper>
    </>
  );
};

export default AccountForm;

const InputWrapper = styled.div`
  margin-bottom: 20px;
  div {
    color: #74c0fc;
  }
  p {
    font-size: 12px;
    color: #495057;
  }
`;

const ButtonWrapper = styled.div`
  margin-top: 20px;
`;
