/* eslint-disable no-underscore-dangle */
import { observable, values } from 'mobx';

const PlatformUIStore = observable({
  /*
    Resource Type : URL 상의 s / f / m
  */
  resourceType: null,

  /*
    Tab Type : 선택된 탭 s / f / m
    (탭 이동시에는 url 변경 없어야 하기 때문)
  */
  tabType: null,
  resourceId: null,
  mainApp: 'talk',
  subApp: null,
  subAppState: undefined,
  layout: 'collapse',

  /*
    Talk Search Input visibility
  */
  isSearchVisible: false,

  // modal
  roomMemberModal: {
    isEdit: false,
    visible: false,
    rect: null,

    open({ top, left, isEdit = false }) {
      this.isEdit = isEdit;
      this.visible = true;
      if (top) {
        this.top = top;
      }
      if (left) {
        this.left = left;
      }
    },

    close() {
      this.visible = false;
    },
  },

  // [TODO] : Talk 안정화 될때까지 임시
  totalUnreadCount: 0,

  // ref
  content: {
    rect: null,
  },

  // windows 관련
  talkWindowMap: new Map(),
  meetingWindowMap: new Map(),

  _getMap(type) {
    switch (type) {
      case 'talk':
        return this.talkWindowMap;
      case 'meeting':
        return this.meetingWindowMap;
      default:
        return null;
    }
  },

  getWindows(type) {
    const targetMap = this._getMap(type);
    if (targetMap) return values(targetMap);
    return null;
  },

  getWindow(type, windowId) {
    const targetMap = this._getMap(type);
    if (targetMap) return targetMap.get(windowId);
    return null;
  },

  openWindow(windowInfo, enableFocus = true) {
    const { id: windowId, type } = windowInfo;
    const targetMap = this._getMap(type);
    if (enableFocus) {
      const targetWindow = targetMap.get(windowId);

      if (targetWindow) {
        this.focusWindow(type, windowId);
      } else {
        targetMap.set(windowId, windowInfo);
      }
    } else {
      targetMap.set(windowId, windowInfo);
    }
  },

  focusWindow(type, windowId) {
    const handler = this.getWindow(type, windowId)?.handler;

    if (handler && !handler.closed) {
      handler.focus();
    }
  },

  closeWindow(type, windowId) {
    const targetMap = this._getMap(type);
    if (targetMap) targetMap.delete(windowId);
  },

  closeAllWindow(type) {
    this.getWindows(type).forEach(window => {
      const { id: windowId } = window;
      const targetMap = this._getMap(type);
      if (targetMap) targetMap.delete(windowId);
    });
  },
});

export default PlatformUIStore;
