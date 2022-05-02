


let difficulty = document.getElementById('difficulty').value;
var Table = new Array(9);
document.getElementById('difficulty').onchange = function() {
  difficulty = this.value;
  };

var autoCheck = false;

document.getElementById('autoCheck').onchange = function() {
    autoCheck = this.checked;
    if (autoCheck && !SolveSudokuSeparate(ReturnDuplicateBoard())) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (!Table[i][j].locked)
                    Table[i][j].innerHTML = "";
            }
        }
        CheckRepetition();
        SelectCell(Table[0][0]);
        NeighboringCells(0, 0);
    }
};

//difficulty = document.getElementById('difficulty');
if(difficulty != null)
    console.log(difficulty);

document.getElementById('newGame').onclick = function() {
    NewGame();
  };

document.getElementById('solve').onclick = function() {
    for (let i = 0; i < 9; i++)
    {
        for (let j = 0; j < 9; j++) {
            if (!Table[i][j].locked)
                Table[i][j].innerHTML = "";
        }
    }
    SolveSuduko();
  };

document.getElementById('clear').onclick = function() {
    for (let i = 0; i < 9; i++)
    {
        for (let j = 0; j < 9; j++) {
            if (!Table[i][j].locked)
                Table[i][j].innerHTML = "";
        }
    }
    CheckRepetition();
    SelectCell(Table[0][0]);
    NeighboringCells(0, 0);
  };










for (let i = 0; i < 9; i++)
{
    Table[i] = document.getElementById('row' + (i+1)).cells;
    //Table[i][0].firstChild.value = "1";
}

for (let i = 0; i < 9; i++)
{
    for (let j = 0; j < 9; j++)
    {
        Table[i][j].locked = false;
        Table[i][j].innerHTML = "";
    }
}

//NeighboringCells(0, 0);
let selectedCell = Table[0][0];
var x = 0;
var y = 0;
let hintCount = difficulty == "Easy" ? 3 : difficulty == "Medium" ? 2 : 1;
selectedCell.bgColor = "cyan";
NeighboringCells(0,0);

let HintButton = document.getElementById('hint');
HintButton.onclick = Hint;
HintButton.textContent = "Hint (" + hintCount + ")";

document.onkeydown = checkKey;

GenerateSolvableBoard();


function ReturnDuplicateBoard() {
    let board = [];
    for(let i = 0; i < 9; i++)
    {
        board[i] = [];
        for(let j = 0; j < 9; j++)
        {
            board[i][j] = Table[i][j].innerHTML;
        }
    }
    return board;
}

//function to give hint for a cell
function Hint()
{
    if (hintCount > 0)
    {
        if(Table[x][y].locked)
            return;

        hintCount--;
        HintButton.textContent = "Hint (" + hintCount + ")";
        if(hintCount == 0) {
            HintButton.disabled = true;
            HintButton.style.backgroundColor = "grey";
        }
    }
    else
    {
        alert("No hints left");
        return;
    }

    let board = ReturnDuplicateBoard();

    if(SolveSudokuSeparate(board) && Table[x][y].innerHTML == "")
    {
        Table[x][y].innerHTML = board[x][y];
        if(!Table[x][y].locked)
        {
            Table[x][y].style.color = "black";
        }
        CheckRepetition();
    }
    else if(Table[x][y].innerHTML != "" && !SolveSudokuSeparate(board))
    {
        Table[x][y].innerHTML = "";
        hintCount++;
        HintButton.textContent = "Hint (" + hintCount + ")";
        HintButton.disabled = false;
        HintButton.style.backgroundColor = "";
        Hint();
    }
    else
    {
        hintCount++;
        HintButton.textContent = "Hint (" + hintCount + ")";
        HintButton.disabled = false;
        HintButton.style.backgroundColor = "";
        alert("Suduko board is unsolvable in its current state, please clear the board and try again");

    }

}

//Function to check if the entered number will lead to a solvable board
function AutoCheckErrors()
{
    let board = ReturnDuplicateBoard();

    if(!SolveSudokuSeparate(board))
    {
        Table[x][y].style.color = "red";
    }

}

//Create a function that makes all the cells of a row glow for a second after all the numbers are placed
function GlowRow(row)
{
    for (let i = 0; i < 9; i++)
    {
        Table[row][i].style.backgroundColor = "yellow";
    }
    setTimeout(function() {
        for (let i = 0; i < 9; i++)
        {
            Table[row][i].style.backgroundColor = "white";
            SelectCell(selectedCell);
            NeighboringCells(x,y);
        }
    }, 500);
}

//Create a function that makes all the cells of a column glow for a second after all the numbers are placed
function GlowColumn(column)
{
    for (let i = 0; i < 9; i++)
    {
        Table[i][column].style.backgroundColor = "yellow";
    }
    setTimeout(function() {
        for (let i = 0; i < 9; i++)
        {
            Table[i][column].style.backgroundColor = "white";
            SelectCell(selectedCell);
            NeighboringCells(x,y);

        }
    }, 500);
}

//Create a function that makes all the cells of a box glow for a second after all the numbers are placed
function GlowBox(row, column)
{
    let boxRow = Math.floor(row / 3);
    let boxColumn = Math.floor(column / 3);
    for (let i = 0; i < 3; i++)
    {
        for (let j = 0; j < 3; j++)
        {
            Table[boxRow * 3 + i][boxColumn * 3 + j].style.backgroundColor = "yellow";
        }
    }
    setTimeout(function() {
        for (let i = 0; i < 3; i++)
        {
            for (let j = 0; j < 3; j++)
            {
                Table[boxRow * 3 + i][boxColumn * 3 + j].style.backgroundColor = "white";
            }
        }
        SelectCell(selectedCell);
        NeighboringCells(x,y);
    }, 500);
}


function SelectCell(cell)
{
    if(selectedCell.style.backgroundColor != "yellow" && selectedCell.style.backgroundColor != "red" && selectedCell.toRed == false)
        selectedCell.style.backgroundColor = "white";
    else if(selectedCell.toRed)
        selectedCell.style.backgroundColor = "red";
    selectedCell = cell;
    if(selectedCell.style.backgroundColor != "yellow"  && selectedCell.style.backgroundColor != "red")
        selectedCell.style.backgroundColor = "cyan";
    else if(selectedCell.style.backgroundColor == "red") {
        selectedCell.style.backgroundColor = "cyan";
        selectedCell.toRed = true;
    }
}

//Create a function to start a new game
function NewGame()
{
    hintCount = difficulty == "Easy" ? 3 : difficulty == "Medium" ? 2 : 1;
    HintButton.textContent = "Hint (" + hintCount + ")";
    HintButton.disabled = false;
    HintButton.style.backgroundColor = "";
    GenerateSolvableBoard();
}

function NeighboringCells(_x, _y)
{
    for(let i = 0; i < 9; i++)
    {
        for (let j = 0; j < 9; j++)
        {
            if(Table[i][j].style.backgroundColor == "yellow" )
            {
             break;
            }
            if((i == _x && j == _y) || Table[i][j].style.backgroundColor == "red")
                continue;
            Table[i][j].style.backgroundColor = "white";
        }
    }

    for(let i = 0; i < 9; i++)
    {

        //console.log(parseInt(i/3));



        if(i != _y)
        {
            if(Table[_x][i].style.backgroundColor != "yellow" && Table[_x][i].style.backgroundColor != "red")
            {
                Table[_x][i].style.backgroundColor = "#5f9ea0";
            }
        }

        if(i != _x)
        {
            if(Table[i][_y].style.backgroundColor != "yellow" && Table[i][_y].style.backgroundColor != "red")
            {
                Table[i][_y].style.backgroundColor = "#5f9ea0";
            }

        }
    }

    var bI = parseInt(_x/3) * 3;
    var bJ = parseInt(_y/3) * 3;

    //console.log(bI);
    for(let i = bI; i < bI + 3; i++)
    {
        for(let j = bJ; j < bJ + 3; j++)
        {
            if(Table[i][j].style.backgroundColor != "yellow" && Table[i][j].style.backgroundColor != "red")
            {
                if(i == _x && j == _y)
                    continue;
                // console.log(i);
                // console.log(j);
                Table[i][j].style.backgroundColor = "#5f9ea0";
            }

        }
    }
}

//Function to check victory
function CheckVictory()
{
    for(let i = 0; i < 9; i++)
    {
        for(let j = 0; j < 9; j++)
        {
            if(Table[i][j].innerHTML == "" || Table[i][j].style.backgroundColor == "red")
            {
                return false;
            }
        }
    }
    return true;
}


function OnInput(input)
{

    for (let i = 0; i < 9; i++)
    {
        for (let j = 0; j < 9; j++)
        {
            if(input == Table[i][j])
            {
                x = i;
                y = j;
                break;
            }
        }
    }

    SelectCell(input);
    NeighboringCells(x, y);


    if(!(input.value > 0 && input.value < 10))
        input.value = "";
   // document.getElementById()
}


function NumberInput(e)
{
    console.log(e);
    for(let i = 1; i < 10; i++)
    {
        if (e.key == i && !selectedCell.locked)
        {
            selectedCell.style.color = "black";
            selectedCell.innerHTML = i;
            CheckRepetition();
            Glow();
            if(CheckVictory())
            {
                setTimeout(function() {
                    alert("You Won!");
                    NewGame();
                }, 1000);
            }
               if(autoCheck) AutoCheckErrors();
        }

        //console.log(i + " Pressed");
    }
    if((e.key == 'Delete' || e.key == 'Backspace') && !selectedCell.locked)
    {
        selectedCell.innerHTML = "";
        CheckRepetition();
    }
}

//Create a function that checks if a number is present in a row
function CheckRow(row, number, board)
{
    if(board != undefined)
    {
        for(let i = 0; i < 9; i++)
        {
            if(board[row][i] == number)
            {
                return true;
            }
        }
    }
    else
    {
        for(let i = 0; i < 9; i++)
        {
            if(Table[row][i].innerHTML == number)
            {
                return true;
            }
        }
    }
    return false;
}

//Create a function that checks if a number is present in a column
function CheckColumn(column, number, board)
{
    if(board != undefined)
    {
        for(let i = 0; i < 9; i++)
        {
            if(board[i][column] == number)
            {
                return true;
            }
        }
    }
    else
    {
        for(let i = 0; i < 9; i++)
        {
            if(Table[i][column].innerHTML == number)
            {
                return true;
            }
        }
    }
    return false;
}

//Create a function that checks if a number is present in a box
function CheckBox(row, column, number, board)
{
    if(board != undefined)
    {

        var bI = Math.floor(row/3) * 3;
        var bJ = Math.floor(column/3) * 3;

        for(let i = bI; i < bI + 3; i++)
        {
            for(let j = bJ; j < bJ + 3; j++)
            {
                if(board[i][j] == number)
                {
                    return true;
                }
            }
        }
    }
    else
    {
        var bI = Math.floor(row/3) * 3;
        var bJ = Math.floor(column/3) * 3;

        for(let i = bI; i < bI + 3; i++)
        {
            for(let j = bJ; j < bJ + 3; j++)
            {
                if(Table[i][j].innerHTML == number)
                {
                    return true;
                }
            }
        }
    }
    return false;
}


//Create a function that checks if a number is present in a row, column or box
function CheckNumber(row, column, number, board)
{
    return CheckRow(row, number, board) || CheckColumn(column, number, board) || CheckBox(row, column, number, board);
}


//Create a function that generates a new suduko board
function GenerateBoard()
{
    var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    var board = [];
    for(let i = 0; i < 9; i++)
    {
        board[i] = [];
        for(let j = 0; j < 9; j++)
        {
            board[i][j] = 0;
        }
    }

    for(let i = 0; i < 9; i++)
    {
        for(let j = 0; j < 9; j++)
        {
            var random = Math.floor(Math.random() * numbers.length);
            board[i][j] = numbers[random];
            numbers.splice(random, 1);
        }
    }

    return board;
}


//Create a function that inserts generated board into the table
function InsertBoard(board)
{
    for(let i = 0; i < 9; i++)
    {
        for(let j = 0; j < 9; j++)
        {
            if(board[i][j] != undefined)
                Table[i][j].innerHTML = board[i][j];
            else
                Table[i][j].innerHTML = "";
        }
    }
}

function SolveSudokuSeparate(board)
{
    for(let i = 0; i < 9; i++)
    {
        for(let j = 0; j < 9; j++)
        {
            if(board[i][j] == "")
            {
                for(let k = 1; k < 10; k++)
                {
                    if(!CheckNumber(i, j, k, board))
                    {
                        board[i][j] = k;
                        if(SolveSudokuSeparate(board))
                            return true;
                        board[i][j] = "";
                    }
                }
                return false;
            }
        }
    }
    return true;
}





//Create a function that solves a suduko puzzle
//using backtracking
function SolveSuduko()
{

    for(let i = 0; i < 9; i++)
    {
        for(let j = 0; j < 9; j++)
        {
            if(Table[i][j].innerHTML == "")
            {
                for(let k = 1; k < 10; k++)
                {
                    if(!CheckNumber(i, j, k))
                    {
                        Table[i][j].innerHTML = k;
                        Table[i][j].style.color = "black";
                        if(SolveSuduko())
                            return true;
                        Table[i][j].innerHTML = "";
                    }
                }
                return false;
            }
        }
    }
    return true;
}

//Create a function that removes numbers from the board to make it playable
//Difficulty level is set by the user
function GenerateSolvableBoard()
{

    var board = GenerateBoard();
    InsertBoard(board);
    SolveSuduko();

    var bI = 0;
    var bJ = 0;



    for(let i = 0; i < 9; i+= 3)
    {
        for(let j = 0; j < 9; j+= 3)
        {
            var chance = difficulty == "Easy" ? 4 : difficulty == "Medium" ? 5 : 6;
            if(Math.random() > 0.5)
                chance++;

            //Generate an array of bool with exactly 4 true values in it
            var arr = [false, false, false, false, false, false, false, false, false];
            for (let k = 0; k < chance; k++)
            {
                let random = 0;
                while(arr[random] != false)
                {
                     random = Math.floor(Math.random() * 9);
                }
                arr[random] = true;
            }


            let index = 0;
            for(let k = 0; k < 3; k++)
            {
                for(let l = 0; l < 3; l++)
                {
                    if(Table[i + k][j + l].innerHTML != "")
                    {
                        if(arr[index])
                        {
                            Table[i + k][j + l].locked = false;
                            Table[i + k][j + l].innerHTML = "";
                        }
                        else
                        {
                            Table[i + k][j + l].locked = true;
                            Table[i + k][j + l].style.color = "blue";
                        }
                        index++;
                    }
                }
            }
        }
    }





}






function CheckRepetition()
{
    for (var i = 0; i < 9; i++)
    {
        for (var j = 0; j < 9; j++)
        {
            let isRep = false;
            for(let k = 0; k < 9; k++)
            {
                if(k != j && Table[i][k].innerHTML == Table[i][j].innerHTML && Table[i][k].innerHTML != "")    isRep = true;
                if(k != i && Table[k][j].innerHTML == Table[i][j].innerHTML && Table[k][j].innerHTML != "")   isRep = true;
            }

            var bI = parseInt(i/3) * 3;
            var bJ = parseInt(j/3) * 3;

            for(let k = bI; k < bI + 3; k++)
            {
                for(let l = bJ; l < bJ + 3; l++)
                {
                    if(i == k && j == l)
                        continue;
                    if(Table[k][l].innerHTML == Table[i][j].innerHTML && Table[k][l].innerHTML != "")
                        isRep = true;
                }
            }

            if(isRep)
                Table[i][j].style.backgroundColor = "red";

            else if(Table[i][j].style.backgroundColor != "yellow")
            {
                Table[i][j].style.backgroundColor = "white";
                Table[i][j].toRed = false;
            }
        }
    }
}

//Function that checks if the row is filled and valid
function CurrentRowFilled(i)
{
    for(let j = 0; j < 9; j++)
    {
        if(Table[i][j].innerHTML == "" || Table[i][j].style.backgroundColor == "red")
            return false;
    }
    return true;
}

//Function that checks if the column is filled and valid
function CurrentColumnFilled(j)
{
    for(let i = 0; i < 9; i++)
    {
        if(Table[i][j].innerHTML == "" || Table[i][j].style.backgroundColor == "red")
            return false;
    }
    return true;
}

//Function that checks if the block is filled and valid
function CurrentBlockFilled(i, j)
{
    var bI = parseInt(i/3) * 3;
    var bJ = parseInt(j/3) * 3;

    for(let k = bI; k < bI + 3; k++)
    {
        for(let l = bJ; l < bJ + 3; l++)
        {
            if(Table[k][l].innerHTML == "" || Table[k][l].style.backgroundColor == "red")
                return false;
        }
    }
    return true;
}

function Glow() {
    if (CurrentRowFilled(x)) {
        GlowRow(x);
    }

    if (CurrentColumnFilled(y)) {
        GlowColumn(y);
    }

    if (CurrentBlockFilled(x, y)) {
        GlowBox(x, y);
    }
}

function checkKey(e) {
    e = e || window.event;

    NumberInput(e);


    if(e.keyCode == '72')
    {
        Hint();
    }
    if (e.keyCode == '37')
    {
        if(y > 0)
        {
            y--;
        }
    }
    else if (e.keyCode == '39')
    {
        if(y < 8)
        {
            y++;
        }

    }
    else if (e.keyCode == '38')
    {

        if(x > 0)
        {
            x--;
        }

    }
    else if (e.keyCode == '40')
    {
        if(x < 8)
        {
            x++;
        }
    }
    //CheckRepetition();
    SelectCell(Table[x][y]);
    NeighboringCells(x, y);
}