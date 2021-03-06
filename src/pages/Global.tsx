import React, { useState, useEffect } from 'react';

import Lottie from 'react-lottie';
import animationData from '../assets/convert_animation.json';

import AuthServiceWrapper from '../components/AuthServiceWrapper';
import {
  Info,
  InputWrap,
  Button,
  Form,
  ProfileImage,
  ProfileImageWrap,
} from './Auth.style';
import InputWithLabel from '../components/InputWithLabel';

import { api } from '../utils/api';
import Input from '../components/Input';

const Global = () => {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState({ username: '', password: '' });
  const [accountInfo, setAccountInfo] = useState<{
    name: string;
    photo: string;
  } | null>(null);

  const handleChange = (e: any) => {
    e.persist();
    setInfo((prevState) => ({ ...prevState, [e.target.id]: e.target.value }));
  };

  const handleLoginSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/account/info', { ...info });
      setAccountInfo(data);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const handleConvertSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/account/convert', { ...info });
      if (data) {
        alert('통합 계정으로 전환이 완료되었습니다.');
      }
    } catch (err) {
      setLoading(false);
      alert(err.response.data.message);
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
  };

  useEffect(() => {
    console.log(info);
  }, [info]);

  return (
    <AuthServiceWrapper
      info={
        accountInfo ? (
          loading ? (
            '전환 중입니다. 잠시만 기다려주세요.'
          ) : (
            <> {accountInfo.name}님, 통합 계정으로 전환하시겠습니까?</>
          )
        ) : (
          '디미고 계정을 통합 계정으로 전환합니다.'
        )
      }
    >
      {accountInfo ? (
        <>
          <Form onSubmit={handleConvertSubmit}>
            {loading ? (
              <>
                <Lottie options={defaultOptions} />
              </>
            ) : (
              <>
                <ProfileImageWrap>
                  <ProfileImage
                    src={`https://api.dimigo.hs.kr/user_photo/${accountInfo.photo}`}
                  />
                </ProfileImageWrap>
                <Button type="submit">전환하기</Button>
              </>
            )}
          </Form>
        </>
      ) : (
        <>
          <Form onSubmit={handleLoginSubmit}>
            <InputWrap>
              <Input
                placeholder="아이디"
                id="username"
                type="text"
                value={info.username}
                onChange={handleChange}
              />
              <Input
                placeholder="비밀번호"
                id="password"
                type="password"
                value={info.password}
                onChange={handleChange}
              />
            </InputWrap>
            <Button type="submit">로그인</Button>
          </Form>
        </>
      )}
    </AuthServiceWrapper>
  );
};

export default Global;
