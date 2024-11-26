/* const textcontent = {
    content: {
      1: ["text", getTranslation('username'),"white"],
      2: ["text", "uniqueId","silver"],
      3: ["text", "comentario = ","gold"],
      4: ["text", "comment","gold"],
      // 4: ["url", "https://example.com", "blue", "Click para ir a mi perfil"]
  
    },
    comment: "texto de prueba123123123",
    // data: {
    //   comment: "texto de prueba123123123",
    //   number: 123,
    //   text: "text",
    // }
  } */
    const newtextcontent = {
        user: {
          name: "username",
          value: "uniqueId comment",
        },
        content: [
          { type: 'text', value: "uniqueId = username" },
          { type: 'text', value: "comentario = comment" },
        ],
      }
      /* const numbercontent = {
        content: {
          1: ["text", getTranslation('username'),"white"],
          2: ["text", "uniqueId","silver"],
          3: ["number", 1,"gold"],
          4: ["text", "= repeatCount","gold"],
          5: ["text", "giftname = rose","cyan"],
        },
        data: {
          number: 123,
          text: "text",
        }
      } */
      const newnumbercontent = {
        user: {
          name: "username",
          value: "texto de prueba123123123",
        },
        content: [
          { type: 'text', value: "UniqueId" },
          { type: 'text', value: "1 = repeatCount" },
          { type: 'text', value: "rose = giftname" },
        ],
      }
      /* const eventcontent = {
        content: {
          1: ["text", "UniqueId","white"],
          2: ["text", getTranslation('followed'),"yellow"],
        },
        data: {
          number: 123,
          text: "text",
        }
      } */
      const neweventcontent = {
        user: {
          name: "username",
          value: "UniqueId",
        },
        content: [
          { type: 'text', value: "UniqueId" },
          { type: 'text', value: getTranslation('followed') },
        ],
      }
//const callbacksmessage = [splitfilterwords,filterwordadd];
//const optionTexts = ['filtrar comentarios - dividir', 'filtrar comentario'];
//const message1 = new ChatMessage( `msg${counterchat.increment()}`, 'https://cdn-icons-png.flaticon.com/128/6422/6422200.png', textcontent, callbacksmessage,optionTexts);
//const message2 = new ChatMessage( `msg${counterchat.increment()}`, 'https://cdn-icons-png.flaticon.com/128/6422/6422200.png', numbercontent);
//const message3 = new ChatMessage( `msg${counterchat.increment()}`, 'https://cdn-icons-png.flaticon.com/128/6422/6422200.png', eventcontent);
// Crear callbacks
//newChatContainer.addMessage(message1);
//newGiftContainer.addMessage(message2);
//newEventsContainer.addMessage(message3);