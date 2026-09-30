import { useEffect, useId, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faChevronDown } from "@fortawesome/free-solid-svg-icons";

/**
 * Select styled like the app's other popovers (see the subject/teacher
 * suggestions and the exam list filters) instead of the native OS menu.
 * Implements the ARIA "select-only combobox" pattern.
 */
const SelectField = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const listboxId = useId();

  const selectedIndex = options.findIndex((option) => option.value === value);
  const selectedOption = options[selectedIndex];

  const open = () => {
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const commit = (index) => {
    onChange(options[index].value);
    close();
  };

  // Close when the pointer goes down anywhere outside the control
  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) close();
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  // Keep the keyboard-highlighted option visible
  useEffect(() => {
    if (!isOpen || activeIndex < 0) return;
    listRef.current?.children[activeIndex]?.scrollIntoView({
      block: "nearest",
    });
  }, [isOpen, activeIndex]);

  const handleKeyDown = (event) => {
    const last = options.length - 1;
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();
        if (!isOpen) {
          open();
          return;
        }
        const step = event.key === "ArrowDown" ? 1 : -1;
        setActiveIndex((index) => Math.min(last, Math.max(0, index + step)));
        break;
      }
      case "Home":
      case "End":
        if (!isOpen) return;
        event.preventDefault();
        setActiveIndex(event.key === "Home" ? 0 : last);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (isOpen && activeIndex >= 0) commit(activeIndex);
        else open();
        break;
      case "Escape":
        if (isOpen) {
          event.preventDefault();
          close();
        }
        break;
      case "Tab":
        close();
        break;
      default:
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <label id={`${id}-label`} htmlFor={id} className="field-label">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </label>
      <button
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-labelledby={`${id}-label ${id}`}
        aria-activedescendant={
          isOpen && activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined
        }
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleKeyDown}
        className={`field flex items-center justify-between gap-3 text-left ${
          isOpen
            ? "bg-surface border-accent shadow-[0_0_0_4px_var(--accent-tint)]"
            : ""
        }`}
      >
        <span className={`truncate ${selectedOption ? "" : "text-label-3"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`text-xs text-label-3 shrink-0 transition-transform duration-300 ease-apple ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-labelledby={`${id}-label`}
          className="absolute z-30 left-0 right-0 top-full mt-1.5 max-h-64 overflow-y-auto material-popover rounded-xl p-1.5 origin-top animate-materialize"
        >
          {options.map((option, index) => {
            const isSelected = index === selectedIndex;
            const isActive = index === activeIndex;
            return (
              <li
                key={option.value}
                id={`${listboxId}-${index}`}
                role="option"
                aria-selected={isSelected}
                onPointerEnter={() => setActiveIndex(index)}
                // Keep focus on the trigger so keyboard handling continues
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => commit(index)}
                className={`menu-item flex items-center justify-between gap-3 cursor-pointer ${
                  isActive ? "!bg-accent !text-white" : ""
                } ${isSelected ? "font-semibold" : ""}`}
              >
                {option.label}
                {isSelected && (
                  <FontAwesomeIcon icon={faCheck} className="text-xs" />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SelectField;
