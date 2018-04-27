const msgTable = document.getElementById('posts');
const newMsgForm = document.getElementById('newMsg');
const boardHeader = document.getElementById('boardName');
const newBtn = document.getElementById('newMsgBtn');
const postBtn = document.getElementById('postBtn');
const msgAPI = 'http://150.165.85.16:9900/api/msgs';

var fixedTexts;

var english = {
	name : "Posted Messages",
	header: "<tr><th onclick='sortTable(0)'>Title &#8645</th><th onclick='sortTable(1)'>Message &#8645</th><th onclick='sortTable(2)'>Posted at &#8645</th><th onclick = 'sortTable(3)'>Author &#8645</th><th>Delete</th></tr>",
//	newMsg: "New message",
	postMsg: "Post"
};

var messages = [];

//poderia fazer um switch aqui pegando a linguagem do usuario pra definir o
//idioma de apresentacao
fixedTexts = english;

function updateView(){
	postBtn.innerHTML = fixedTexts.postMsg;
	boardHeader.innerHTML = fixedTexts.name;
//	msgTable.innerHTML = fixedTexts.header + messages.join("");
	msgTable.innerHTML = fixedTexts.header + assembleMsgs();
}

//newMsgForm.style.display = "none";
hideForm();

function showForm(){
	newMsgForm.style.display = "block";
}

function hideForm(){
	newMsgForm.style.display = "none";
}

function assembleMsgToSend(){
	var mObj = {
		"title" : newMsgForm.Title.value,
		"msg" : newMsgForm.Message.value,
		"author" : "Ravi",
		"credentials" : "ravi:142857" //pegar o id quando postar o frontend e o secret com o prof.
	}
	var msg = JSON.stringify(mObj);
	return msg;
}
/*
function assembleMsgs(){
	return messages.map(e => `<tr><td>${e.title}</td><td>${e.msg}</td><td>${e.created_at}</td><td>${e.author}</td></tr>`).join("\n");
}
*/
function assembleMsgs(){
	return messages.map(prettifyMsg).join("\n");
}

function prettifyMsg(e){
	var preamble = `<tr><td>${e.title}</td><td>${e.msg}</td><td>${e.created_at}</td><td>${e.author}</td>`;
	var myMsg;
	if(e.frontend == "ravi")	{
		console.log(e);
		myMsg = `<td><button class="delete" id=${e.id} type="button" onclick="deleteMsg(${e.id})">del</button></td></tr>`;
	}
	else{
		myMsg = `<td></td></tr>`;
	}
	return (preamble+myMsg);
}

function deleteMsg(msgId){
	console.log('msgId: ' + msgId);
	var toSend = JSON.stringify({"credentials":"ravi:142857"});
	fetch(msgAPI+'/'+msgId,
	{
    method: "DELETE",
    body: toSend
	});

  retrieveMessages();
  updateView();
}

//funcao chamada pelo botao Post, deve chamar a assembleMsgToSend e fazer um fetch via post
function addMessage(){
	var toSend = assembleMsgToSend();
	fetch(msgAPI,
	{
    method: "POST",
    body: toSend
	});
	hideForm();
  retrieveMessages();
  updateView();
}

function retrieveMessages(){
	fetch(msgAPI)
	.then(r => r.json() )
	.then(data => {
		Object.assign(messages, data);
		updateView();
	});
}

function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("posts");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc"; 
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByTagName("TR");
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++; 
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

function filterTable(col) {
  // Declare variables 
  var input, filter, table, tr, td, i;
  input = document.getElementById("myInput"+col);
  filter = input.value.toUpperCase();
  table = document.getElementById("posts");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[col];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    } 
  }
}

retrieveMessages();
updateView();