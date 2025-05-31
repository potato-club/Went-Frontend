import React, { useState } from "react";
import styled from "styled-components";

const items = [1, 2, 3, 4, 5];

const Slider: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const total = items.length;

  const prev = () => setCurrent((prev) => (prev - 1 + total) % total);
  const next = () => setCurrent((prev) => (prev + 1) % total);

  return (
    <CarouselContainer>
      <ArrowButton left onClick={prev}>{"<"}</ArrowButton>

      <Slides>
        {items.map((item, index) => {
          let offset = index - current;
          const half = Math.floor(total / 2);
          if (offset > half) offset -= total;
          if (offset < -half) offset += total;

          if (Math.abs(offset) > 1) return null;

          return (
            <Slide key={index} offset={offset}>
              {item}
            </Slide>
          );
        })}
      </Slides>

      <ArrowButton onClick={next}>{">"}</ArrowButton>
    </CarouselContainer>
  );
};

export default Slider;

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;
  height: 300px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const Slides = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Slide = styled.div<{ offset: number }>`
  position: absolute;
  top: 25px;
  left: 50%;
  width: 415px;
  height: 250px;
  background: #e2e2e2;
  opacity: ${(props) => (props.offset === 0 ? 1 : 0.5)};
  border-radius: 16px;

  transform: translateX(
      calc(${(props) => props.offset} * 410px - 50%)
    )
    scale(${(props) => (props.offset === 0 ? 1 : 0.9)});

  transition: all 0.4s ease;
  z-index: ${(props) => (props.offset === 0 ? 2 : 1)};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
`;

const ArrowButton = styled.button<{ left?: boolean }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: ${(props) =>
    props.left
      ? "calc(50% - 200px - 20px)"
      : "calc(50% + 186px)"};
  background: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  font-size: 1rem;
  z-index: 10;
`;
