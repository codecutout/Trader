import * as Linq from "linq"
import * as TWEEN from "tween.js";
import {Properties} from "./Properties";

export class ShipUtil{
    static TypeName = "Ship";

    static IsShip(layerObj:Tiled.LayerObject): layerObj is Ship{
        return layerObj && layerObj.type === this.TypeName;
    }

    static TotalResources(ship:Ship):number{
        return Linq.from(ship.properties).where(kvp=>Properties.IsInventory(kvp.key)).sum(kvp=>kvp.value as number);
    }
}

export interface Ship extends Tiled.LayerObject{
    properties:{
        playerId:number;

        resourceLimit:number;
        moveToTileIndex:number;
        moveFromTileIndex:number;

        _moveTween:TWEEN.Tween;
        _moveToPoints:{x:number,y:number}[];
        _moveFromPoints:{x:number,y:number}[];
    };
}
