import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  > header {
    height: 100px;
    background: #28262e;

    display: flex;
    align-items: center;

    div {
      width: 100%;
      max-width: 1120px;
      margin: 0 auto;

      svg {
        color: #999591;
        width: 24px;
        height: 24px;
      }
    }
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: -65px auto 0;

  width: 100%;

  form {
    /* margin: 80px 0; */
    width: 340px;
    text-align: center;
    display: flex;
    flex-direction: column;

    h1 {
      color: #232324;
      margin-bottom: 24px;
      font-size: 20px;
      text-align: left;
    }

    a {
      color: #565656;
      display: block;
      margin-top: 24px;
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: ${shade(0.2, '#565656')};
      }
    }
  }
`;

export const AvatarInput = styled.div`
  /* margin-bottom: 32px; */
  position: relative;
  align-self: center;

  img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }
`;
