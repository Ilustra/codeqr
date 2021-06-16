import React from 'react';

import AuthContext from '../context/auth';

export function ExpErr(status, data) {

    console.log('statusErr', status)
    console.log('dataERR',data.error)

    switch(status){
        case 403:{
            return data[0].message
        }
        case 400:{
            return data.error
        }
        case 401:{
            return data[0].message
        }
    }   
}