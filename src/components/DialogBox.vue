<script lang="ts">
import { defineComponent, type PropType } from 'vue';
export type DialogDataOption = {displayAs:string,value:any}
export type DialogData={options:Array<DialogDataOption>,default:DialogDataOption} | undefined
export default defineComponent({
    name:'DialogElement',
    emits:['selectedDialog'],
    props:{
        data: { type: Object as PropType<DialogData>, required:true },
    },
    data:()=>{
        return {
            text:'',
            options:[] as Array<DialogDataOption>,
            default:{displayAs:'',value:false} as DialogDataOption,
            visible:false,
        }
    },
    watch:{
        data(newData: DialogData){
            if(newData===undefined){
                this.options=[]
                this.visible=false
                this.default={displayAs:'',value:false}
                return
            }
            this.options=newData.options
            this.default=newData.default
            this.visible=true
        },
        visible(newVisible:boolean){
            const el = document.getElementById('dialog') as HTMLDialogElement
            if(newVisible){
                el.showModal()
            } else {
                el.close()
            }
        }
    },
    methods:{
        close(arg?:DialogDataOption){
            if(arg===undefined){
                arg=this.default.value
            }
            this.$emit('selectedDialog',arg)
            this.visible=false
            if(this.data!==undefined){
                this.default=this.data.default
            }
            else{
                this.default={displayAs:'',value:false}
            }
        }
    },
    created(){
        if(this.data!==undefined){
            this.options=this.data.options
            this.default=this.data.default
            this.visible=true
        }
    },
    mounted(){
        (document.getElementById('dialog') as HTMLDialogElement).addEventListener('cancel',(event)=>{event.preventDefault();this.close()})
    }
})
</script>
<template>
<dialog id="dialog" v-show="visible">
    <div class="header">
        <button @click="close()">x</button>
    </div>
    <slot></slot>
    <div class="footer">
        <button v-for="option in options" @click="close(option.value)">{{ option.displayAs }}</button>
    </div>
</dialog>
</template>
<style scoped>
button,
button[type="button"]{
  @apply border border-black py-1.5 px-2 rounded-lg;
}
dialog{
    @apply max-w-[50vw] p-3 border rounded-lg;
}
dialog::backdrop{
    @apply bg-gray-500;
    opacity: 0.5;
}
.header{
    @apply flex flex-row mb-1;
    margin-top:-0.5rem;
    margin-right:-0.5rem;
}
.header button{
    @apply ml-auto bg-transparent border-0;
}
.footer{
    @apply flex flex-row mt-2;
}
.footer button{
    @apply mx-2;    
}
.footer button:last-child{
    @apply ml-auto mr-0;
}
.footer button:first-child{
    @apply ml-0 mr-auto;
}
</style>