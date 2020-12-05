import {DataSource} from './app/DataSource.mjs';
import cluster  from 'cluster';
import {cpus} from 'os';
import {startWorker} from './worker.mjs';
import FastMQ from 'fastmq';
import dotenv from 'dotenv';

import MessageService from "./app/services/MessageService.mjs";

import {Message} from './app/DataSource.mjs';

dotenv.config();
let clusterWorker;
let pid=process.pid;
if (cluster.isMaster){
    console.log("Start http server...");
    
    console.log("Update SQL schema...");
    DataSource.sync({force:true})
    .then(result=>console.log(result))
    .catch(err=> console.log(err));
    console.log("SQL schema was updated");

    let cpusNum=cpus().length;
    console.log("CPUs "+cpusNum);
    console.log(`Master started. Pid: ${pid}`);
    for (let i=0;i<cpusNum-1;i++){
        clusterWorker = cluster.fork();
    }

    cluster.on("exit",(worker,code)=>{
        console.log(`Worker died! Pid: ${worker.process.pid}. Code ${code}`);
        if (code==1)
            cluster.fork();
    });

    console.log("Server started");
}

if (cluster.isWorker){
    startWorker();
}