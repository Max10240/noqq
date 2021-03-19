import Vue from 'vue'
import Router from 'vue-router'

import index from '../components/index'
import messages from '../components/messages'
import contact from '../components/contact'
import movement from '../components/movement'
import persons from '../components/persons'
import groups from '../components/groups'
import groupchats from '../components/groupchats'
import chatroom from '../components/chatroom'
// eslint-disable-next-line camelcase
import new_friend from '../components/new_friend'
// eslint-disable-next-line camelcase
import new_group from '../components/new_group'

import login from '../components/login'
import register from '../components/register'
import testonly from '../components/testonly'
// eslint-disable-next-line camelcase
import search_people_group from '../components/search_people_group'
// eslint-disable-next-line camelcase
import search_people from '../components/search_people'
// eslint-disable-next-line camelcase
import search_group from '../components/search_group'
// eslint-disable-next-line camelcase
import do_search_people from '../components/do_search_people'
import settings from '../components/settings'
// eslint-disable-next-line camelcase
import account_manage from '../components/account_manage'
// eslint-disable-next-line camelcase
import person_info from '../components/person_info'
// eslint-disable-next-line camelcase
import ask_group from '../components/ask_group'
// eslint-disable-next-line camelcase
import ask_people from '../components/ask_people'
import select_server_path from "../components/select_server_path";

Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: '/index',
            component: index,
            meta: {index: 3},
            children: [
                {path: 'messages', component: messages, meta: {index: 4}},
                {path: 'movement', component: movement, meta: {index: 4}},
                {
                    path: 'contact',
                    component: contact,
                    children: [
                        {
                            path: '*',
                            meta: {index: 4},
                            components: {
                                persons: persons,
                                groups: groups,
                                groupchats: groupchats
                            }
                        }
                    ]
                },
                {path: '*', redirect: 'messages'}
            ]
        },
        {path: '/login', component: login, meta: {index: 1}},
        {path: '/register', component: register, meta: {index: 2}},
        {path: '/chatroom/:type/:id', component: chatroom, meta: {index: 7, enableSwipeRight: true}},
        {path: '/newfriend', component: new_friend, meta: {index: 5, enableSwipeRight: true}},
        {path: '/newgroup', component: new_group, meta: {index: 5, enableSwipeRight: true}},
        {path: '/test', component: testonly, meta: {index: 10}},
        {
            path: '/searchpg',
            component: search_people_group,
            meta: {index: 6},
            children: [
                {path: 'people', component: search_people, meta: {index: 6}},
                {path: 'group', component: search_group, meta: {index: 6}},
                {path: '*', redirect: 'people'}
            ]
        },
        {path: '/dosearchpeople', component: do_search_people, meta: {index: 7}},
        {path: '/settings', component: settings, meta: {index: 5}},
        {path: '/accountmanage', component: account_manage, meta: {index: 6}},
        {path: '/person_info/:type/:id', component: person_info, meta: {index: 6}},
        {path: '/askgroup/:id', component: ask_group, meta: {index: 8}},
        {path: '/askpeople/:id', component: ask_people, meta: {index: 8}},
        {path: '/selectserver', component: select_server_path, meta: {index: 5}},
        {path: '*', redirect: '/index/'}
    ]
});

export default router
