import React, { useState } from 'react';
import { Minus, Plus, Users, Edit2, Check } from 'lucide-react';
import type { Person } from '../types/split';

interface PeopleInputProps {
  people: Person[];
  onUpdatePeopleCount: (newCount: number) => void;
  onRenamePerson: (id: string, newName: string) => void;
}

export const PeopleInput: React.FC<PeopleInputProps> = ({
  people,
  onUpdatePeopleCount,
  onRenamePerson,
}) => {
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  const count = people.length;

  const handleDecrement = () => {
    if (count > 1) {
      onUpdatePeopleCount(count - 1);
    }
  };

  const handleIncrement = () => {
    if (count < 20) {
      onUpdatePeopleCount(count + 1);
    }
  };

  const startEditing = (p: Person) => {
    setEditingPersonId(p.id);
    setEditingName(p.name);
  };

  const saveEditing = () => {
    if (editingPersonId && editingName.trim()) {
      onRenamePerson(editingPersonId, editingName.trim());
    }
    setEditingPersonId(null);
    setEditingName('');
  };

  return (
    <div className="bg-white rounded-3xl p-4 shadow-xs border border-stone-150 mb-3.5 transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-800 m-0">จำนวนคน</h2>
            <p className="text-[11px] text-stone-400 m-0">1 - 20 คน (แตะที่ชื่อเพื่อเปลี่ยนชื่อได้)</p>
          </div>
        </div>

        {/* Stepper with big, easy touch buttons */}
        <div className="flex items-center gap-2 bg-stone-50 p-1 rounded-2xl border border-stone-200">
          <button
            type="button"
            id="people-decrement-btn"
            onClick={handleDecrement}
            disabled={count <= 1}
            aria-label="ลดจำนวนคน"
            className="w-8 h-8 rounded-xl bg-white text-stone-700 flex items-center justify-center shadow-xs border border-stone-200/80 active:scale-90 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </button>

          <span
            id="people-count-display"
            className="w-8 text-center text-base font-bold text-stone-900"
          >
            {count}
          </span>

          <button
            type="button"
            id="people-increment-btn"
            onClick={handleIncrement}
            disabled={count >= 20}
            aria-label="เพิ่มจำนวนคน"
            className="w-8 h-8 rounded-xl bg-white text-stone-700 flex items-center justify-center shadow-xs border border-stone-200/80 active:scale-90 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* People tag chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 pb-0.5">
        {people.map((person, idx) => {
          const isEditing = editingPersonId === person.id;
          return (
            <div
              key={person.id}
              className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 group hover:border-orange-300 transition-all"
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: person.avatarColor || '#F97316' }}
              />

              {isEditing ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEditing();
                    }}
                    autoFocus
                    className="w-20 px-1 py-0.5 text-xs bg-white border border-orange-400 rounded outline-none"
                  />
                  <button
                    type="button"
                    onClick={saveEditing}
                    className="p-0.5 text-emerald-600 hover:text-emerald-700 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => startEditing(person)}
                  className="flex items-center gap-1 cursor-pointer font-medium"
                  title="แตะเพื่อเปลี่ยนชื่อ"
                >
                  <span>{person.name || `คนที่ ${idx + 1}`}</span>
                  <Edit2 className="w-2.5 h-2.5 text-stone-300 group-hover:text-stone-500" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
