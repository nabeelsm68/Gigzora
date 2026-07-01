"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

export default function PipelineBoard() {
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    const { data, error } = await supabase
      .from("leads")
      .select("*");

    if (error) {
      console.error(error);
      return;
    }

    setLeads(data || []);
  }

  async function onDragEnd(result: any) {
    if (!result.destination) return;

    const leadId = result.draggableId;

    const newStatus =
      result.destination.droppableId;

    const { error } = await supabase
      .from("leads")
      .update({
        status: newStatus,
      })
      .eq("id", leadId);

    if (error) {
      console.error(error);
      return;
    }

    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              status: newStatus,
            }
          : lead
      )
    );
  }

  const statuses = [
    "NEW",
    "CONTACTED",
    "REPLIED",
    "CLIENT",
  ];

  function gradeColor(grade: string) {
    if (grade?.includes("HOT")) {
      return "bg-green-500/15 text-green-400";
    }

    if (grade?.includes("WARM")) {
      return "bg-yellow-500/15 text-yellow-400";
    }

    return "bg-blue-500/15 text-blue-400";
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>

      <div className="grid grid-cols-4 gap-6">

        {statuses.map((status) => {

          const columnLeads = leads.filter(
            (lead) =>
              (lead.status || "NEW") === status
          );

          return (

            <Droppable
              droppableId={status}
              key={status}
            >
              {(provided, snapshot) => (

                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`
                  rounded-3xl
                  border
                  p-5
                  min-h-[650px]
                  transition-all
                  duration-200

                  ${
                    snapshot.isDraggingOver
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-zinc-800 bg-zinc-900/40"
                  }
                  `}
                >

                  <div className="mb-6">

                    <div className="flex items-center justify-between">

                      <h2 className="font-bold text-xl">
                        {status}
                      </h2>

                      <span
                        className="
                        bg-zinc-800
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        "
                      >
                        {columnLeads.length}
                      </span>

                    </div>

                  </div>

                  <div className="space-y-4">

                    {columnLeads.map(
                      (lead, index) => (

                        <Draggable
                          key={lead.id}
                          draggableId={lead.id}
                          index={index}
                        >
                          {(provided, snapshot) => (

                            <div
                              ref={
                                provided.innerRef
                              }
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided
                                  .draggableProps
                                  .style,
                                zIndex:
                                  snapshot.isDragging
                                    ? 9999
                                    : "auto",
                              }}
                              className={`
                              rounded-2xl
                              border
                              bg-zinc-950
                              p-4
                              shadow-xl
                              transition-all
                              duration-200
                              cursor-grab

                              ${
                                snapshot.isDragging
                                  ? `
                                    scale-105
                                    rotate-2
                                    border-blue-500
                                    shadow-blue-500/30
                                  `
                                  : `
                                    border-zinc-800
                                    hover:border-blue-500/40
                                  `
                              }
                              `}
                            >

                              <h3 className="font-semibold text-base">
                                {lead.business_name}
                              </h3>

                              <p
                                className="
                                text-zinc-500
                                text-sm
                                mt-2
                                truncate
                                "
                              >
                                {lead.email}
                              </p>

                              <div
                                className="
                                flex
                                justify-between
                                items-center
                                mt-4
                                "
                              >

                                <span
                                  className={`
                                  px-3
                                  py-1
                                  rounded-full
                                  text-xs
                                  font-medium
                                  ${gradeColor(
                                    lead.lead_grade
                                  )}
                                  `}
                                >
                                  {lead.lead_grade}
                                </span>

                                <span
                                  className="
                                  font-semibold
                                  "
                                >
                                  {lead.lead_score}
                                </span>

                              </div>

                            </div>

                          )}
                        </Draggable>

                      )
                    )}

                    {provided.placeholder}

                  </div>

                </div>

              )}
            </Droppable>

          );
        })}

      </div>

    </DragDropContext>
  );
}