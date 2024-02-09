<script lang="ts">
import { defineComponent, PropType } from 'vue';
import DialogBox from './DialogBox.vue';
import type { DialogData } from './DialogBox.vue';
export type BoardDimensions={x:number,y:number}
type possibleAdjacentMines=0|1|2|3|4|5|6|7|8|9
type BoardCell={
    adjacentMines:possibleAdjacentMines,
    isMine:boolean,
    visible:boolean,
    flaggedAsMine:boolean
}
export default defineComponent({
    components:{
        DialogBox:DialogBox
    },
    props:{
        dimensions:{type:Object as PropType<BoardDimensions>,required:true}
    },
    data:()=>{
        return {
            board:[] as Array<BoardCell>,
            generatedMines:false,
            dialogData:undefined as DialogData,
            dialogMessage:'',
            remainingMines:0,
        }
    },
    methods:{
        toIndex(x:number,y:number){
            return x+y*this.dimensions.x
        },
        toCords(index:number){
            return [index%this.dimensions.x,Math.floor(index/this.dimensions.x)]
        },
        getNeighbours(index:number){
            const cords=this.toCords(index)
            const x=cords[0]
            const y=cords[1]
            let ret=[]
            if(y+1<this.dimensions.y){
                ret.push(this.toIndex(x,y+1))
                if(x+1<this.dimensions.x){
                    ret.push(this.toIndex(x+1,y+1))
                }
                if(x-1>-1){
                    ret.push(this.toIndex(x-1,y+1))
                }
            }
            if(y-1>-1){
                ret.push(this.toIndex(x,y-1))
                if(x+1<this.dimensions.x){
                    ret.push(this.toIndex(x+1,y-1))
                }
                if(x-1>-1){
                    ret.push(this.toIndex(x-1,y-1))
                }
            }
            if(x+1<this.dimensions.x){
                ret.push(this.toIndex(x+1,y))
            }
            if(x-1>-1){
                ret.push(this.toIndex(x-1,y))
            }
            //console.log(index,ret)
            return ret
        },
        generateBoard(clickedIndex:number){
            this.board=[]
            for(let i=0;i<this.dimensions.x*this.dimensions.y;i++){
                this.board.push({adjacentMines:0,isMine:false,visible:false,flaggedAsMine:false})
            }
            const indexNeighbours=this.getNeighbours(clickedIndex)
            indexNeighbours.push(clickedIndex)
            for(let i=0;i<this.remainingMines;i++){
                while(true){
                    const index=Math.floor(Math.random()*this.board.length)
                    if(!this.board[index].isMine && !indexNeighbours.includes(index)){
                        this.board[index].isMine=true
                        break
                    }
                }
            }
            for(let i=0;i<this.board.length;i++){
                let sum=this.board[i].isMine?1:0
                for(let index of this.getNeighbours(i)){
                    if(this.board[index].isMine) sum++
                }
                this.board[i].adjacentMines=sum as possibleAdjacentMines
            }
            this.generatedMines=true
        },
        handleClick(index:number){
            if(!this.generatedMines){
                this.generateBoard(index)
            }
            if(this.board[index].isMine){
                this.generateBoard(index)
                this.dialogData={options:[], default:{displayAs:'',value:false}}
                this.dialogMessage='Try again'
                console.log("lost")
                return
            }
            this.clear(index,[])
            this.checkWin()
        },
        clear(index:number,visited:Array<boolean>){
            visited[index]=true
            this.board[index].visible=true
            if(this.board[index].adjacentMines!==0) return
            for(let neighbour of this.getNeighbours(index)){
                if(!visited[neighbour] && !this.board[neighbour].isMine){
                    this.clear(neighbour,visited)
                }
            }
        },
        checkWin(){
            for(let cell of this.board){
                if(!cell.isMine && ! cell.visible) return
            }
            this.dialogData={options:[], default:{displayAs:'',value:false}}
            this.dialogMessage='Congratulations'
            this.resetBoard()
        },
        resetBoard(){
            this.generatedMines=false
            this.board=[]
            this.remainingMines=Math.floor(this.dimensions.x*this.dimensions.y/7)
            for(let i=0;i<this.dimensions.x*this.dimensions.y;i++){
                this.board.push({adjacentMines:0,isMine:false,visible:false,flaggedAsMine:false})
            }
        },
        handleRightClick(cell:BoardCell){
            if(cell.visible) return
            this.remainingMines+=(cell.flaggedAsMine)?1:-1
            cell.flaggedAsMine=!cell.flaggedAsMine
        }
    },
    computed:{
        boardRows(){
            const ret=[]
            for(let i=0;i<this.dimensions.y;i++){
                ret.push(this.board.slice(i*this.dimensions.x,(i+1)*this.dimensions.x))
            }
            return ret
        },
        cellStyle(){
            const width=Math.floor(0.9*Math.min(window.innerHeight/this.dimensions.y,window.innerWidth/this.dimensions.x))
            return 'width:'+width+'px; height:'+width+'px'
        }
    },
    created(){
        this.resetBoard()
    }
})
</script>
<template>
    <DialogBox :data="dialogData">{{ dialogMessage }}</DialogBox>
    <div class="flex flex-row justify-center">
        <div class="flex flex-col items-center">
            <div>Minecount: {{ remainingMines }}</div>
            <div v-for="row,outerIntex in boardRows" class="flex flex-row">
                <div v-for="cell,innerIndex in row" class="border border-accent text-center align-middle" :class="(cell.visible)?'':((cell.flaggedAsMine)?'bg-accent':'bg-secondary dark:bg-dsecondary')" :style="cellStyle" @click.left="handleClick(outerIntex*dimensions.x+innerIndex)" @click.right.prevent="handleRightClick(cell)">
                    <span v-if="cell.visible && cell.adjacentMines">{{ cell.adjacentMines }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
</style>