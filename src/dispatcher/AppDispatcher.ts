import { AppAction } from "../types/types";

type DispatchCallback = (action: AppAction) => void;

let _callbacks: { [id: string]: DispatchCallback } = {};
let _lastID: number = 1;

const AppDispatcher = {
  register(callback: DispatchCallback): string {
    const id = 'CID_' + _lastID++;
    _callbacks[id] = callback;
    return id;
  },

  dispatch(action: AppAction): void {
    for (const id in _callbacks) {
      if (_callbacks.hasOwnProperty(id)) {
        try {
          _callbacks[id](action);
        } catch (error) {
          console.error(`Dispatcher: Error in callback ${id}:`, error);
        }
      }
    }
  },
};

export default AppDispatcher;