document.addEventListener("DOMContentLoaded", () => {
  const mainCharacter = document.querySelector(".main");
  const girlCharacter = document.querySelector(".girl");
  const richGuyCharacter = document.querySelector(".rich-guy");
  const heartsContainer = document.querySelector(".hearts-container");
  const mainBubble = document.querySelector(".main-bubble");
  const girlBubble = document.querySelector(".girl-bubble");
  const richGuyBubble = document.createElement("div");
  richGuyBubble.classList.add("speech-bubble", "rich-guy-bubble");
  document.querySelector(".game-container").appendChild(richGuyBubble);

  let positionX = 10; // Initial position of main character (% of viewport width)
  const speed = 1; // Reduced speed of movement

  let isMovingLeft = false;
  let isMovingRight = false;
  let isConversationActive = false; // Restrict movement during conversation
  let hasConversationHappened = false; // Ensure conversation happens only once
  let scene2Active = false;

  // Function to start walking animation
  function startWalking(direction, character, rowY) {
    if (direction === "right") {
      character.style.animation = `walk-right 0.5s steps(3) infinite`;
      character.style.backgroundPositionY = `${rowY}px`;
    } else if (direction === "left") {
      character.style.animation = `walk-left 0.5s steps(3) infinite`;
      character.style.backgroundPositionY = `${rowY}px`;
    }
  }

  // Function to stop walking animation
  function stopWalking(character) {
    character.style.animation = "none";
  }

  // Function to move the character
  function moveCharacter() {
    if (isConversationActive || scene2Active) return;

    if (isMovingRight) {
      if (positionX < 90) {
        positionX += speed;
      }
    }
    if (isMovingLeft) {
      if (positionX > 0) {
        positionX -= speed;
      }
    }
    mainCharacter.style.left = `${positionX}%`;
    detectCollision();
  }

  // Collision detection
  function detectCollision() {
    const mainRect = mainCharacter.getBoundingClientRect();
    const girlRect = girlCharacter.getBoundingClientRect();

    if (
      mainRect.right > girlRect.left &&
      mainRect.left < girlRect.right &&
      mainRect.bottom > girlRect.top &&
      mainRect.top < girlRect.bottom
    ) {
      if (!hasConversationHappened) {
        stopWalking(mainCharacter);
        startConversation();
      }
    }
  }

  // Function to start the conversation
  function startConversation() {
    isConversationActive = true;
    hasConversationHappened = true;

    girlCharacter.style.animation = "girl-turn-left 0.5s steps(4) forwards";

    const conversation = [
      { speaker: "main", text: "Hi, I'm glad to meet you!" },
      { speaker: "girl", text: "Oh, hello! It's nice to meet you too." },
      { speaker: "main", text: "You look beautiful today." },
      { speaker: "girl", text: "Aw, thank you! You're sweet." },
      { speaker: "main", text: "Would you like to go on a date?" },
      { speaker: "girl", text: "I'd love to!" },
    ];

    let dialogueIndex = 0;

    function showDialogue() {
      if (dialogueIndex < conversation.length) {
        const line = conversation[dialogueIndex];
        if (line.speaker === "main") {
          girlBubble.style.display = "none";
          mainBubble.textContent = line.text;
          mainBubble.style.display = "block";
        } else {
          mainBubble.style.display = "none";
          girlBubble.textContent = line.text;
          girlBubble.style.display = "block";
        }
        dialogueIndex++;
        setTimeout(showDialogue, 2000);
      } else {
        mainBubble.style.display = "none";
        girlBubble.style.display = "none";
        triggerHeartAnimation();
      }
    }

    showDialogue();
  }

  // Function to handle the heart animation
  function triggerHeartAnimation() {
    for (let i = 0; i < 10; i++) {
      const heart = document.createElement("div");
      heart.classList.add("heart");
      heart.style.left = `${40 + Math.random() * 20}%`;
      heart.style.top = `${60 + Math.random() * 10}%`;
      heartsContainer.appendChild(heart);
      setTimeout(() => {
        heart.remove();
      }, 3000);
    }
    setTimeout(() => {
      startScene2();
    }, 3000);
  }

  // Function to start Scene 2
  function startScene2() {
    if (!scene2Active) {
      scene2Active = true;

      girlCharacter.style.left = "45%";
      richGuyCharacter.style.left = "55%";
      richGuyCharacter.style.display = "block";

      let girlPosition = 45;
      startWalking("right", girlCharacter, -704);

      const interval = setInterval(() => {
        girlPosition += 0.5;
        girlCharacter.style.left = `${girlPosition}%`;

        if (girlPosition >= 52) {
          clearInterval(interval);
          stopWalking(girlCharacter);
          richGuyCharacter.style.animation = "none";
          richGuyCharacter.style.backgroundPositionY = "-64px"; // Turn to 2nd row
          setTimeout(() => {
            startDialogueBetweenGirlAndRichGuy();
          }, 500);
        }
      }, 50);
    }
  }

  // Dialogue between the girl and the rich guy
  function startDialogueBetweenGirlAndRichGuy() {
    let dialogueIndex = 0;
    const conversation = [
      { speaker: "rich-guy", text: "Hey, you look stunning." },
      { speaker: "girl", text: "Oh, thank you!" },
      { speaker: "rich-guy", text: "Would you like to go out with me?" },
      { speaker: "girl", text: "Sure, let's go!" },
    ];

    function showDialogue() {
      if (dialogueIndex < conversation.length) {
        const line = conversation[dialogueIndex];
        if (line.speaker === "rich-guy") {
          girlBubble.style.display = "none";
          richGuyBubble.textContent = line.text;
          richGuyBubble.style.display = "block";
          richGuyBubble.style.left = "55%";
          richGuyBubble.style.bottom = "130px";
        } else {
          richGuyBubble.style.display = "none";
          girlBubble.textContent = line.text;
          girlBubble.style.display = "block";
          girlBubble.style.left = "50%";
          girlBubble.style.bottom = "130px";
        }
        dialogueIndex++;
        setTimeout(showDialogue, 2000);
      } else {
        girlBubble.style.display = "none";
        richGuyBubble.style.display = "none";
        walkOutTogether();
      }
    }

    showDialogue();
  }

  // Function for girl and rich guy walking out together
  function walkOutTogether() {
    let girlPosition = 52;
    let richGuyPosition = 55;

    startWalking("right", girlCharacter, -704);
    startWalking("right", richGuyCharacter, -704);

    const interval = setInterval(() => {
      girlPosition += 0.5;
      richGuyPosition += 0.5;

      girlCharacter.style.left = `${girlPosition}%`;
      richGuyCharacter.style.left = `${richGuyPosition}%`;

      if (girlPosition > 100 && richGuyPosition > 100) {
        clearInterval(interval);
        stopWalking(girlCharacter);
        stopWalking(richGuyCharacter);
        triggerMainCharacterReaction();
      }
    }, 50);
  }

  // Main character's reaction after the girl and rich guy leave
  function triggerMainCharacterReaction() {
    mainBubble.textContent = "No... This can't be happening...";
    mainBubble.style.display = "block";

    setTimeout(() => {
      mainBubble.style.display = "none";

      // Trigger death animation frame-by-frame
      let frame = 0;
      const totalFrames = 13; // Assuming 13 frames in the 21st row
      const frameWidth = 64; // Each frame's width in pixels
      const deathRowY = -1344; // Y-position for the 21st row

      mainCharacter.style.display = "block"; // Ensure the character is visible
      const deathAnimationInterval = setInterval(() => {
        mainCharacter.style.backgroundPositionX = `-${frame * frameWidth}px`; // Horizontal frame
        mainCharacter.style.backgroundPositionY = `${deathRowY}px`; // Vertical position
        frame++;

        if (frame >= totalFrames) {
          clearInterval(deathAnimationInterval);
          mainCharacter.style.display = "none";
          alert("The main character has died of a broken heart.");
        }
      }, 200);
    }, 2000);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "d" || event.key === "D") {
      if (!isMovingRight) {
        isMovingRight = true;
        startWalking("right", mainCharacter, -704);
      }
    } else if (event.key === "a" || event.key === "A") {
      if (!isMovingLeft) {
        isMovingLeft = true;
        startWalking("left", mainCharacter, -576);
      }
    }
  });

  document.addEventListener("keyup", (event) => {
    if (event.key === "d" || event.key === "D") {
      isMovingRight = false;
    } else if (event.key === "a" || event.key === "A") {
      isMovingLeft = false;
    }

    if (!isMovingLeft && !isMovingRight) {
      stopWalking(mainCharacter);
    }
  });

  setInterval(moveCharacter, 16);

  // Add header dynamically
  const header = document.createElement("header");
  header.style.position = "fixed";
  header.style.top = "0";
  header.style.width = "100%";
  header.style.height = "60px";
  header.style.backgroundColor = "#333";
  header.style.color = "white";
  header.style.display = "flex";
  header.style.alignItems = "center";
  header.style.justifyContent = "space-between"; // Space elements evenly between left and right
  header.style.padding = "0 20px";
  header.style.boxSizing = "border-box";

  const title = document.createElement("div");
  title.textContent = "What A Story";
  title.style.fontFamily = "'Press Start 2P', cursive"; // Pixelated font
  title.style.fontSize = "16px";
  title.style.color = "white";

  const controls = document.createElement("div");
  controls.textContent = "A for Left | D for Right";
  controls.style.fontFamily = "'Press Start 2P', cursive"; // Pixelated font
  controls.style.fontSize = "12px";
  controls.style.color = "white";
  controls.style.textAlign = "right"; // Ensure right alignment of the text

  header.appendChild(title); // Add title to the left
  header.appendChild(controls); // Add controls to the right
  document.body.prepend(header);

  // Add footer dynamically
  const footer = document.createElement("footer");
  footer.style.position = "fixed";
  footer.style.bottom = "0";
  footer.style.width = "100%";
  footer.style.height = "60px";
  footer.style.backgroundColor = "#333";
  footer.style.color = "white";
  footer.style.display = "flex";
  footer.style.alignItems = "center";
  footer.style.justifyContent = "center";

  const footerText = document.createElement("div");
  footerText.textContent =
    "Yea this story was very disappointing, yea life is as well. Just accept it!";
  footerText.style.fontFamily = "'Press Start 2P', cursive"; // Pixelated font
  footerText.style.fontSize = "12px";
  footerText.style.textAlign = "center";

  footer.appendChild(footerText);
  document.body.appendChild(footer);
});
