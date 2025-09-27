import { _decorator, Component, Enum, instantiate, Label, Node, Prefab } from 'cc';
import { PlayerController } from './PlayerController';
const { ccclass, property } = _decorator;


    //创建保存小方块格子的类型,使用的是枚举
    enum BlockType{
        BT_NONE, //表示空格子
        BT_WHITE,
    };

    enum GameState {
        GS_MENU,    //开始菜单按钮
        GS_PLAYING,  //游戏游玩界面
        // GS_END       //游戏结束界面
    }

@ccclass('GameManager')
export class GameManager extends Component {
    

    @property(Node)
    public boxP: Node = null;
   
    //创建地图方块的预制体
    @property(Prefab)
    public boxPrefab:Prefab = null;
    //设置地图的长度
    @property
    public roadLength =50;
    //定义一个数组,用来保存所有的格子类型的
    private _road:BlockType[]=[];

    // private gameState   //定义当前的状态（如果需要的话可以增加）

    @property(PlayerController)
    public playController:PlayerController =null;

    @property(Node)
    public startMenu:Node =null;    //用来控制菜单的ui界面的显示
    
    @property(Label)
    public stepLabel:Label = null;


    start() {
        // this.generateRoad();
        this.setCurState(GameState.GS_MENU); //开始的时候在开始的菜单

        //通过调用playercontroller里面的节点去监听jumpend(跳跃失败)的事件
        this.playController.node.on('jumpEnd',this.onJumpEnd,this)
    }

    //定义状态切换的方法 
    setCurState(value:GameState){
        if(value==GameState.GS_MENU){
            //菜单界面
        this.generateRoad();
        this.playController.setIsControl(false);    //表示了这时候不能去控制player

            this.startMenu.active =true;    //表示ui是激活状态

        //禁用playcontroller的控制

        }else if(value==GameState.GS_PLAYING){
            this.playController.setIsControl(true);
            this.startMenu.active =false;

        }
    }
    //检测按钮被点击时会触发的方法
    onStartButtonClick(){
        this.setCurState(GameState.GS_PLAYING);
    }
    onJumpEnd(value:number){
        this.stepLabel.string =value.toString();
    }

    //定义生成地图的方法
    //生成方块的类型
    generateRoad(){
        //游戏开始时清楚所有的数据
        this.node.removeAllChildren(); //用来消除所有的子节点

        this._road=[]; //游戏运行时将数组清空
        //将一个数据储存在数组里面
        this._road.push(BlockType.BT_WHITE); //生成的第一个格子必须是白色的格子

        for(let i=1;i<this.roadLength;i++){
            //前一个方块为空的话,下一个方块就要指定为白块,不为空的话就随机生成一个方块
            if(this._road[i - 1]==BlockType.BT_NONE){
                this._road.push(BlockType.BT_WHITE);
            }else{
            this._road.push(Math.round(Math.random()));
            // this._road.push(Math.floor(Math.random()*2));  //两种方法,选一种就行
            }
        }

        for(let j =1;j<this.roadLength;j++){
            if(this._road[j]==BlockType.BT_WHITE){
                const box = instantiate(this.boxPrefab);
            //将box节点的父节点设置
            box.setParent(this.boxP);
            box.setPosition(j*40,0,0);
            }
        }
        
    }
        

    
        

    // update(deltaTime: number) {
        
    // }


}
